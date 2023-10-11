<?php

namespace Deployer;

require 'recipe/common.php';
require 'contrib/rsync.php';
require '/root/.composer/vendor/autoload.php';
require '/root/.composer/vendor/mittwald/deployer-recipes/recipes/deploy.php';

// Config

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts

mittwald_app()
    ->set('public_path', '/')
    ->set('mittwald_app_dependencies', []);

// Hooks

after('deploy:failed', 'deploy:unlock');
