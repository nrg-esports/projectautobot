defmodule Scraper.Application do
  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    Application.start :hound

    # Define workers and child supervisors to be supervised
    children = [
      # Starts a worker by calling: Scraper.Worker.start_link(arg1, arg2, arg3)
      # worker(Scraper.Worker, [arg1, arg2, arg3]),
      supervisor(Scraper.SessionServer, [])
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Scraper.Supervisor]
    Supervisor.start_link(children, opts)
  end

end
