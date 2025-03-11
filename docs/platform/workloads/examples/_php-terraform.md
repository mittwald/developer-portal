```hcl
data "mittwald_systemsoftware" "php" {
  name     = "php"
  selector = "^8.4"
}

data "mittwald_systemsoftware" "composer" {
  name        = "composer"
  recommended = true
}

data "mittwald_systemsoftware" "mysql" {
  name        = "composer"
  recommended = true
}

resource "mittwald_app" "php" {
  project_id = mittwald_project.example.id

  app     = "php"
  version = "1.0.0"

  description   = "Test-App"
  document_root = "/public"
  update_policy = "none"

  databases = [
    {
      kind    = "mysql"
      purpose = "primary"
      id      = mittwald_mysql_database.example.id
      user_id = mittwald_mysql_database.example.user.id
    }
  ]

  dependencies = {
    (data.mittwald_systemsoftware.php.name) = {
      version       = data.mittwald_systemsoftware.php.version
      update_policy = "patchLevel"
    }
    (data.mittwald_systemsoftware.composer.name) = {
      version       = data.mittwald_systemsoftware.composer.version
      update_policy = "patchLevel"
    },
    (data.mittwald_systemsoftware.mysql.name) = {
      version       = data.mittwald_systemsoftware.mysql.version
      update_policy = "patchLevel"
    },
  }
}
```
