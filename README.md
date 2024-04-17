# AI pat

Mads' AI tool.

The project is built on the submodule KasQL in order to import data from Airtable to a MySQL database.

The central **Cockpit** is available in ./server/public/cockpit.js

## Configuration

### .env

You should create an ".env" file at root with following content:

    APP_PORT=<port to be used by Docker>

    #MYSQL_HOST=host.docker.internal
    MYSQL_HOST=127.0.0.1
    MYSQL_USERNAME=root
    MYSQL_PORT=3306
    MYSQL_DATABASE=aipat
    MYSQL_ROOT_PASSWORD=<mysql password>
    CED_CODE=<password to admin panel>

    envname=<DEV || PROD>

    # Matomo
    MATOMO_URL=//matomo.viggo.medu.au.dk/
    MATOMO_SITEID=8

    # airtable ai-pat
    AIRTABLE_KEY=<airtable key>
    AIRTABLE_BASE=<airtable base>

