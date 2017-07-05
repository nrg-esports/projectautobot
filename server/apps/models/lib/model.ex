defmodule Models.Model do
  import Ecto.Query, only: [limit: 2, order_by: 2, where: 3, from: 2, subquery: 1]

  defmacro __using__(_) do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.{Query, Changeset}
    end
  end

  defmacro create_model_methods(model) do
    quote do
      unquote(create_get_for_model(model))
      unquote(create_find_for_model(model))
      unquote(create_get_by_ids_for_model(model))
      unquote(create_get_all_for_model(model))
      unquote(create_update_for_model(model))
    end
  end

  def create_model_filter({:first, val}, query), do: limit(query, ^val)
  def create_model_filter({:last, val}, query), do: from(query, order_by: [desc: :inserted_at], limit: ^val) |> subquery |> order_by(asc: :inserted_at)
  def create_model_filter({:start_date, val}, query), do: where(query, [m], m.inserted_at >= ^(val))
  def create_model_filter({:end_date, val}, query), do: where(query, [m], m.inserted_at <= ^val)

  # @spec create_field_averages(Ecto.Schema.t) :: Ecto.Queryable.t
  # def create_field_averages(model) do
  #   import Ecto.Query

  #   fields = model.__struct__(:field) -- [:id]

  #   Enum.reduce(fields, from(model), fn field ->

  #   end)
  # end

  def find_model(model, params) when is_map(params), do: find_model(model, Map.to_list(params))
  def find_model(_, params) when is_list(params) and length(params) <= 0, do: {:error, "no params given for find"}
  def find_model(model, params) when is_list(params) do
    case params && Models.Repo.get_by(model, params) do
      nil -> {:error, "where #{inspect(params)} not found"}
      user -> {:ok, user}
    end
  end

  defp get_model_name(model), do: ~r/[^\.]+$/ |> Regex.run(Macro.to_string(model)) |> List.first |> Macro.underscore

  defp pluralize_model_name("game_history"), do: "game_histories"
  defp pluralize_model_name("hero"), do: "heroes"
  defp pluralize_model_name(model_name), do: model_name <> "s"

  defp get_and_pluralize_model_name(model), do: model |> get_model_name |> pluralize_model_name

  defp create_get_all_for_model(model) do
    fn_name = :"get_all_#{get_and_pluralize_model_name(model)}"

    quote do
      import Ecto.Query, only: [from: 2]

      @spec unquote(fn_name)() :: [unquote(model)]
      def unquote(fn_name)(), do: Models.Repo.all(unquote(model))

      @spec unquote(fn_name)(params :: map) :: [unquote(model)]
      def unquote(fn_name)(params) when is_map(params) do
        params = Map.to_list(params)

        apply(__MODULE__, unquote(fn_name), [params])
      end

      @spec unquote(fn_name)(where :: Keyword.t, preload :: Keyword.t) :: [unquote(model)]
      def unquote(fn_name)(where, preload \\ []) do
        from(unquote(model), where: ^where, preload: ^preload) |> Models.Repo.all
      end
    end
  end

  defp create_get_for_model(model) do
    fn_name = :"get_#{get_model_name(model)}"

    quote do
      import Ecto.Query, only: [from: 2]

      @spec unquote(fn_name)(id :: String.t, preloads :: Keyword.t) :: unquote(model)
      def unquote(fn_name)(id, preloads \\ []) do
        case from(unquote(model), preload: ^preloads) |> Models.Repo.get(id) do
          nil -> {:error, "#{unquote(get_display_model_name(model))} #{id} not found"}
          model -> {:ok, model}
        end
      end
    end
  end

  defp create_update_for_model(model) do
    fn_name = :"update_#{get_model_name(model)}"

    quote do
      @spec unquote(fn_name)(id :: integer, params :: map) :: unquote(model)
      def unquote(fn_name)(id, params) when is_integer(id) do
        case Models.Repo.get(unquote(model), id) do
          nil -> {:error, "No post found with id - #{id}"}
          model ->
            unquote(model).changeset(model, params)
              |> Models.Repo.update
        end
      end

      @spec unquote(fn_name)(model :: unquote(model), params :: map) :: unquote(model)
      def unquote(fn_name)(model_data, params), do: unquote(model).changeset(model_data, params) |> Models.Repo.update
    end
  end

  defp create_find_for_model(model) do
    fn_name = :"find_#{get_model_name(model)}"

    quote do
      @spec unquote(fn_name)(params :: map) :: unquote(model)
      def unquote(fn_name)(params), do: Models.Model.find_model(unquote(model), params)
    end
  end

  defp create_get_by_ids_for_model(model) do
    fn_name = :"get_#{get_and_pluralize_model_name(model)}_by_ids"

    quote do
      @spec unquote(fn_name)(ids :: [String.t]) :: [unquote(model)]
      def unquote(fn_name)(ids) do
        import Ecto.Query, only: [from: 2]

        from(m in unquote(model), where: m.id in ^ids)
          |> Models.Repo.all
      end
    end
  end

  defp get_display_model_name(model) do
    model
      |> get_model_name
      |> String.split("_")
      |> Enum.map(&String.capitalize/1)
      |> Enum.join(" ")
  end
end
