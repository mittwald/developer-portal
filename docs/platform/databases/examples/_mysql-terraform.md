```hcl
variable "database_password" {
  type      = string
  sensitive = true
}

resource "mittwald_mysql_database" "example_database" {
  project_id  = mittwald_project.example.id
  version     = "8.4"
  description = "Example"

  character_settings = {
    character_set = "utf8mb4"
    collation     = "utf8mb4_general_ci"
  }

  user = {
    access_level        = "full"
    password_wo         = var.database_password
    password_wo_version = 1
    external_access     = false
  }
}
```
