```hcl
resource "random_password" "postgres_password" {
  length = 24
}

data "mittwald_container_image" "postgres" {
  image = "postgres:17"
}

resource "mittwald_container_stack" "postgresql" {
  project_id    = mittwald_project.example.id
  default_stack = true

  containers = {
    postgresql = {
      description = "PostgreSQL Database Server"
      image       = data.mittwald_container_image.postgres.image
      entrypoint  = data.mittwald_container_image.postgres.entrypoint
      command     = data.mittwald_container_image.postgres.command
      
      environment = {
        POSTGRES_DB       = "mydatabase"
        POSTGRES_USER     = "myuser"
        POSTGRES_PASSWORD = random_password.postgres_password.result
      }
      
      volumes = [
        {
          volume = "postgresql_data"
          mount_path = "/var/lib/postgresql/data"
        },
        {
          project_path = "/files/postgresql-backups"
          mount_path = "/mnt"
        }
      ]
      
      ports = [
        {
          container_port = 5432
          public_port    = 5432
          protocol       = "tcp"
        }
      ]
    }
  }

  volumes = {
    postgresql_data = {}
  }
}
```