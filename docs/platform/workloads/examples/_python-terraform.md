```hcl
data "mittwald_systemsoftware" "python" {
  name     = "python"
  selector = "^3.13"
}

resource "mittwald_app" "python" {
  project_id = mittwald_project.example.id

  app         = "python"
  version     = "1.0.0"
  description = "Test-App"

  user_inputs = {
    entrypoint = "python server.py"
  }

  dependencies = {
    (data.mittwald_systemsoftware.python.name) = {
      version       = data.mittwald_systemsoftware.python.version
      update_policy = "patchLevel"
    }
  }
}
```
