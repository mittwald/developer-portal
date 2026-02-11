```hcl
variable "mariadb_password" {
  type      = string
  sensitive = true
}

variable "mariadb_root_password" {
  type      = string
  sensitive = true
}

data "mittwald_container_image" "mariadb" {
  image = "mariadb:lts-ubi9"
}

resource "mittwald_container_stack" "mariadb" {
  project_id    = mittwald_project.example.id
  default_stack = true

  containers = {
    mariadb = {
      description = "MariaDB Database Server"
      image       = data.mittwald_container_image.mariadb.image
      entrypoint  = data.mittwald_container_image.mariadb.entrypoint
      command     = data.mittwald_container_image.mariadb.command

      environment = {
        MARIADB_DATABASE      = "mydatabase"
        MARIADB_USER          = "myuser"
        MARIADB_PASSWORD      = var.mariadb_password
        MARIADB_ROOT_PASSWORD = var.mariadb_root_password
      }

      volumes = [
        {
          volume = "mariadb_data"
          mount_path = "/var/lib/mysql"
        },
        {
          project_path = "/files/mariadb-backups"
          mount_path = "/mnt"
        }
      ]

      ports = [
        {
          container_port = 3306
          public_port    = 3306
          protocol       = "tcp"
        }
      ]
    }
  }

  volumes = {
    mariadb_data = {}
  }
}
```
