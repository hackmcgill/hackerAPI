#!/bin/bash/python3

import requests
import json
import getpass

print("Enter target API")
DEFAULT_API = 'https://api.mchacks.ca'

API_URL = input('Target API (Default '+DEFAULT_API+'):')

if API_URL == '':
    API_URL = DEFAULT_API

# Get credentials
print("Enter credentials for", API_URL)
username = input("Email: ")

s = requests.Session()

logged_in = False

while not logged_in:
    password = getpass.getpass("Password: ")
    CREDENTIALS = {
        'email': username,
        'password': password
    }
    r = s.post('{0}/api/auth/login'.format(API_URL), CREDENTIALS)

    if r.status_code != 200:
        print("Incorrect password, please try again.")
    else:
        print('Logged in as {0}'.format(username))
        logged_in = True

# Get information about batch actions

ACCEPT_ID_FILE = input("Path to file with hackerIDs:")

hackerIds = []
with open(ACCEPT_ID_FILE, 'r') as f:
    rows = f.readlines()
    for r in rows:
        hackerIds.append(r.strip())
# remove duplicates
hackerIds = list(set(hackerIds))

VALID_STATUSES = ['Applied', 'Accepted', 'Waitlisted',
                  'Confirmed', 'Cancelled', 'Checked-in']

INITIAL_STATUS = input(
    "Inital status required " + str(VALID_STATUSES) + ":")

BATCH_ACTIONS = ['status', 'dayOf', 'weekOf']

BATCH_ACTION = input(
    "Batch Action desired " + str(BATCH_ACTIONS) + ":")


def updateStatus():

    NEW_STATUS = input(
        "Status to update to " + str(VALID_STATUSES) + ":")

    for index, ID in enumerate(hackerIds):
        # so that we aren't 0-based index
        index = index + 1
        r1 = s.get('{0}/api/hacker/{1}'.format(API_URL, ID))
        if r1.status_code != 200:
            print('({0}/{1}) ERROR cannot get {2}'.format(index, len(hackerIds), ID))
        else:
            hackerInfo = json.loads(r1.content)
            if hackerInfo['data']['status'] == INITIAL_STATUS:
                r2 = s.patch('{0}/api/hacker/status/{1}'.format(API_URL, ID),
                             {"status": NEW_STATUS})
                if r2.status_code != 200:
                    print(
                        '({0}/{1}) ERROR cannot update status for {2}'.format(index, len(hackerIds), ID))
                else:
                    print(
                        '({0}/{1}) {2} {3}'.format(index, len(hackerIds), NEW_STATUS, ID))


def sendDayOfEmail():
    for index, ID in enumerate(hackerIds):
        # so that we aren't 0-based index
        index = index + 1
        r1 = s.get('{0}/api/hacker/{1}'.format(API_URL, ID))
        if r1.status_code != 200:
            print('({0}/{1}) ERROR cannot get {2}'.format(index, len(hackerIds), ID))
        else:
            hackerInfo = json.loads(r1.content)
            if hackerInfo['data']['status'] == INITIAL_STATUS:
                r2 = s.post(
                    '{0}/api/hacker/email/dayOf/{1}'.format(API_URL, ID))
                if r2.status_code != 200:
                    print(
                        '({0}/{1}) ERROR cannot send email to {2}'.format(index, len(hackerIds), ID))
                else:
                    print(
                        '({0}/{1}) Sent email to {2}'.format(index, len(hackerIds), ID))
            else:
                print('({0}/{1}) {2} does not have status {3} (status: {4})'.format(index,
                                                                                    len(hackerIds), ID, INITIAL_STATUS, hackerInfo['data']['status']))


def sendWeekOfEmail():
    for index, ID in enumerate(hackerIds):
        # so that we aren't 0-based index
        index = index + 1
        r1 = s.get('{0}/api/hacker/{1}'.format(API_URL, ID))
        if r1.status_code != 200:
            print('({0}/{1}) ERROR cannot get {2}'.format(index, len(hackerIds), ID))
        else:
            hackerInfo = json.loads(r1.content)
            if hackerInfo['data']['status'] == INITIAL_STATUS:
                r2 = s.post(
                    '{0}/api/hacker/email/weekOf/{1}'.format(API_URL, ID))
                if r2.status_code != 200:
                    print(
                        '({0}/{1}) ERROR cannot send email to {2}'.format(index, len(hackerIds), ID))
                else:
                    print(
                        '({0}/{1}) Sent email to {2}'.format(index, len(hackerIds), ID))
            else:
                print('({0}/{1}) {2} does not have status {3} (status: {4})'.format(index,
                                                                                    len(hackerIds), ID, INITIAL_STATUS, hackerInfo['data']['status']))


if BATCH_ACTION == 'weekOf':
    sendWeekOfEmail()
elif BATCH_ACTION == 'dayOf':
    sendDayOfEmail()
elif BATCH_ACTION == 'status':
    updateStatus()
