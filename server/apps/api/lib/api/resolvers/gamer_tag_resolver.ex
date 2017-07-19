defmodule Api.GamerTagResolver do
  import Api.Helpers, only: [preload_id_map: 2]

  alias Models.Game

  def all(%{}, _info), do: {:ok, Game.get_all_gamer_tags()}
  def all(params, _info), do: {:ok, Game.get_all_gamer_tags(params)}
  def find(params, _info), do: Game.find_gamer_tag(params)

  def scrape(%{id: gamer_tag_id}, _info), do: Scraper.scrape_gamer_tag_id(gamer_tag_id)
  def scrape(%{region: _, platform: _, tag: _} = params, _info), do: scrape_by_tag_platform_region(params, [:platform, :tag, :region])
  def scrape(%{platform: _, tag: _} = params, _info), do: scrape_by_tag_platform_region(params, [:platform, :tag])
  def scrape(_, _info), do: {:error, "Must provide one of id, platform/region/tag or platform/tag if xbl/psn"}

  def search(%{tag: tag}, _info), do: Scraper.search_tag(tag)

  def get_gamer_tags_user(_, gamer_tags), do: preload_id_map(gamer_tags, :user)
  def get_gamer_tag_following_users(_, gamer_tag_ids), do: Game.get_following_users_by_gamer_tag_ids(gamer_tag_ids)

  def get_gamer_tag_connected_gamer_tags(_, gamer_tags) do
    gamer_tags
      |> Enum.map(&{&1, Game.get_connected_gamer_tags(&1)})
      |> Enum.reduce(%{}, fn {gamer_tag, connected_tags}, acc ->
        Map.put(acc, gamer_tag.id, connected_tags)
      end)
  end

  defp scrape_by_tag_platform_region(params, param_fields) do
    with %{gamer_tag: %{id: id}} <- params |> Map.take(param_fields) |> Scraper.get_profile do
      Game.get_gamer_tag_with_snapshots(id)
    end
  end
end
