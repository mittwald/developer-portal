terraform {
  required_providers {
    mittwald = {
      source = "mittwald/mittwald"
      version = "1.0.0-alpha5"
    }
  }

  cloud {
    organization = "mittwald"
    workspaces {
      name = "developer-portal"
    }
  }
}

variable "mittwald_api_key" {
  type        = string
  description = "The API token for the Mittwald API"
  sensitive   = true
}

provider "mittwald" {
  api_key = var.mittwald_api_key
}

variable "hostname" {
  type = string
  default = "developer.mittwald.de"
}

variable "matomo_user" {
  type = object({
    username = string
    email = string
    password = string
  })

  sensitive = true
}

resource "mittwald_project" "developer_portal" {
  description = "mittwald Developer Portal"
}

resource "mittwald_app" "developer_portal" {
  project_id = mittwald_project.developer_portal.id

  app = "static"
  version = "1.0.0"

  update_policy = "patchLevel"
  description = "Developer Portal"
}

resource "mittwald_app" "matomo" {
  project_id = mittwald_project.developer_portal.id

  app = "matomo"
  version = "5.0.3"

  update_policy = "patchLevel"
  description = "DX Analytics"

  user_inputs = {
    "host" = var.hostname
    "admin_user" = var.matomo_user.username
    "admin_email" = var.matomo_user.email
    "admin_pass" = var.matomo_user.password
  }
}

resource "mittwald_virtualhost" "developer_portal" {
  project_id = mittwald_project.developer_portal.id
  hostname = var.hostname

  paths = {
    "/" = {
      app = mittwald_app.developer_portal.id
    }
    "/stats" = {
      app = mittwald_app.matomo.id
    }
  }
}
