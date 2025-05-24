```hcl
locals {
  nginx_port = 80
}

resource "mittwald_container_stack" "nginx" {
  project_id    = mittwald_project.example.id
  default_stack = true

  containers = {
    nginx = {
      description = "Example web server"
      image       = "nginx:1.27.4"

      ports = [
        {
          container_port = 80
          public_port    = local.nginx_port
          protocol       = "tcp"
        }
      ]

      /* ... */
    }
  }
}

resource "mittwald_virtualhost" "nginx" {
  hostname   = "your-domain.example"
  project_id = mittwald_project.test.id

  paths = {
    "/" = {
      container = {
        container_id = mittwald_container_stack.nginx.containers.nginx.id
        port         = "${local.nginx_port}/tcp"
      }
    }
  }
}
```
