<?php

namespace Deployer;

require 'recipe/common.php';
require 'contrib/rsync.php';

if (getenv("CI") !== false) {
    require '/root/.composer/vendor/autoload.php';
    require '/root/.composer/vendor/mittwald/deployer-recipes/recipes/deploy.php';
} else {
    require getenv('HOME') . '/.composer/vendor/autoload.php';
    require getenv('HOME') . '/.composer/vendor/mittwald/deployer-recipes/recipes/deploy.php';
}

// Config

add('shared_files', [".htaccess", ".htpasswd"]);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts

mittwald_app()
    ->set('public_path', '/')
    ->set('mittwald_app_dependencies', []);

// Hooks

task('deploy:prepare', [
    'deploy:info',
    'deploy:setup',
    'deploy:lock',
    'deploy:release',
    'rsync',
    'deploy:shared',
    'deploy:writable',
]);

after('deploy:failed', 'deploy:unlock');
