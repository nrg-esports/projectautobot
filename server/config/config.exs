# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

# By default, the umbrella project as well as each child
# application will require this configuration file, ensuring
# they all use the same configuration. While one could
# configure all applications here, we prefer to delegate
# back to each application for organization purposes.
import_config "../apps/*/config/config.exs"

config :distillery, no_warn_missing: [:elixir_make]

# Sample configuration (overrides the imported configuration above):
#
config :logger, :console, level: :info,
                          compile_time_purge_level: :info,
                          format: "[$level] $time\n$metadata\n$message\n",
                          metadata: [
                            :callback_uri,
                            :client_id,
                            :client_auth_token,
                            :client_access_token
                          ]

#       format: "$date $time [$level] $metadata$message\n",
#       metadata: [:user_id]
