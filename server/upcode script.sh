#!/usr/bin/env bash

SERVER_IP='103.54.250.167'
SERVER_PORT='22'

SourceDir='/Users/nguyenmt/PycharmProjects/VaultDragonCodingTest/CodingTest'
SYSTEM="value_dragon"
MAIN_PROJECT="CodingTest"

set_environment() {
    SERVER_IP="$1";
#    SSH_USER=$(ssh $SERVER_IP -tt "whoami" | sed 's/[^a-zA-Z0-9-]//g');
#    SSH_GROUP=$(ssh $SERVER_IP -tt "groups $SSH_USER" | awk '{ print $3 }' | sed 's/[^a-zA-Z0-9-]//g');
#    SSH_HOME=$(ssh $SERVER_IP -tt "pwd" | sed 's:[^-a-zA-Z0-9\ \/]::g');

    SSH_USER="nguyenmt";
    SSH_GROUP="nguyenmt";
    SSH_HOME="/home/nguyenmt";
}

snapshot_source_code() {
    SERVER_IP="$1"
    SOURCE_PATH="$2"
    TODAY=$(date +%Y%m%d.%H%M%S)

    set_environment $SERVER_IP
    ssh -o StrictHostKeyChecking=no "$SERVER_IP" -p "$SERVER_PORT" -tt "
        echo [snapshot] $SSH_HOME/$SOURCE_PATH
        sudo mv $SSH_HOME/$SOURCE_PATH $SSH_HOME/$SOURCE_PATH.$TODAY
        sudo chown $SSH_USER:$SSH_GROUP -R $SSH_HOME
    "
}

upcode() {
#    scp -o StrictHostKeyChecking=no -P $SERVER_PORT -r "$SourceDir" $SERVER_IP:/$SSH_HOME/$SYSTEM/$MAIN_PROJECT
#    ssh -o StrictHostKeyChecking=no "$SERVER_IP" -p "$SERVER_PORT" -tt "
#        sudo supervisorctl stop js_test_api
#        sudo supervisorctl start js_test_api
#    "

    SourceDir=/Users/nguyenmt/PycharmProjects/VaultDragonCodingTest/server/$MAIN_PROJECT.zip;
    cd /Users/nguyenmt/PycharmProjects/VaultDragonCodingTest/CodingTest;
    zip -r $SourceDir ./* &>/dev/null;

    scp -o StrictHostKeyChecking=no -P $SERVER_PORT -r "$SourceDir" $SERVER_IP:/$SSH_HOME/$SYSTEM/$MAIN_PROJECT.zip
    ssh -o StrictHostKeyChecking=no "$SERVER_IP" -p "$SERVER_PORT" -tt "
        unzip -o /$SSH_HOME/$SYSTEM/$MAIN_PROJECT.zip -d /$SSH_HOME/$SYSTEM/$MAIN_PROJECT &> /dev/null;
        sudo supervisorctl stop js_test_api
        sudo supervisorctl start js_test_api
    "
}


set_environment $SERVER_IP
snapshot_source_code $SERVER_IP "$SYSTEM/$MAIN_PROJECT"
upcode
