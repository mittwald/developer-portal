```hcl
ephemeral "mittwald_mysql_password" "example_database_password" {
  length = 24
}

resource "mittwald_mysql_database" "example_database" {
  // ...

  user = {
    password_wo         = ephemeral.mittwald_mysql_password.example_database_password.password
    password_wo_version = 1

    // ...
  }
}
```
