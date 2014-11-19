Install the Heroku Toolbelt

Download and install the Heroku Toolbelt or learn more about the Heroku Command Line Interface.

If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.

    $ heroku login

    $ heroku create taxi-beesightsoft --region us --stack cedar --buildpack https://github.com/heroku/heroku-buildpack-php


Create a new Git repository

Initialize a git repository in a new or existing directory

    $ mkdir taxi-beesightsoft; cd $_
    $ git init
    $ heroku git:remote -a taxi-beesightsoft


Deploy your application

Commit your code to the repository and deploy it to Heroku using Git.

    $ git add .
    $ git commit -am "make it better"
    $ git push heroku master



Create the project #
However you prefer, get your Laravel project initialized.

    $ composer create-project laravel/laravel --prefer-dist laravel-heroku
    $ cd laravel-heroku


We need to generate and include composer.lock in the repo, but Laravel's default .gitignore ignores composer.lock.

    Remove composer.lock from .gitignore
    $ composer install





Initialize the git repo #
OK, our code is ready to go. Let's get it into git.

    $ git init
    $ git add .
    $ git commit -m "Initial commit of stock Laravel install."

Create the Heroku app #
Since you have the Heroku Toolbelt installed, you can create and modify your apps directly from the command line.

    $ heroku create


Deploy your code to the Heroku app #
With Heroku, you push new code to your site by pushing to the heroku git remote.

    $ git push heroku master