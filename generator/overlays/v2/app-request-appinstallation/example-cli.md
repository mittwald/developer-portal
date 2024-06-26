```shellsession
$ mw app create php \
    --project-id $PROJECT_ID \
    --site-title "My TYPO3 site"
    
$ mw app install typo3 \
    --version 12.4.16 \
    --install-mode composer \
    --project-id $PROJECT_ID \
    --admin-email admin@typo3.example \
    --admin-pass securepassword \
    --admin-user admin \
    --site-title "My TYPO3 site" 
```