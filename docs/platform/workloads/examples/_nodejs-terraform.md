```hcl
data "mittwald_systemsoftware" "node" {
  name     = "node"
  selector = "^22.0"
}

resource "mittwald_app" "nodejs" {
  project_id = mittwald_project.example.id

  app         = "node"
  version     = "1.0.0"
  description = "Test-App"

  user_inputs = {
    entrypoint = "npm start"
  }

  dependencies = {
    (data.mittwald_systemsoftware.node.name) = {
      version       = data.mittwald_systemsoftware.node.version
      update_policy = "patchLevel"
    }
  }
}
```
