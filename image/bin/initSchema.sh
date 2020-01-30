#!/bin/bash

source /opt/abacus/abacus-postgres/lib/postgresFunctions.sh $*

postgresProcessSqlDir /opt/abacus/abacus-web-ui/etc/pgsql/
