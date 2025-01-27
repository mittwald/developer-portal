# Password security

<!--
NOTE: This document is linked from various places with in the API reference.
DO NOT change the document ID or the header IDs
-->

Various API calls enforce password policies. This document serves as a reference for different password policies enforced by the mStudio API.

## MySQL user passwords {#mysql}

Passwords for MySQL users must fulfill the following requirements:

- at least 8 characters
- at least one lowercase character
- at least one uppercase character
- at least one digit
- at least one special character out of `#!~%^*_+-=?{}()<>|.,;`
