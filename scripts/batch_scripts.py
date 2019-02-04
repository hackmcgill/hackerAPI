#!/bin/bash/python3
import base64
from bson import ObjectId
import getpass
import json
import os
import requests
import subprocess
from typing import Any, Callable, List

# Constants
VALID_STATUSES = {
    '1': 'Applied',
    '2': 'Accepted',
    '3': 'Waitlisted',
    '4': 'Confirmed',
    '5': 'Cancelled',
    '6': 'Checked-in'
}
BATCH_ACTIONS = {
    '1': 'updateStatus',
    '2': 'dayOf',
    '3': 'weekOf',
    '4': 'downloadResume'
}


API_URL = 'https://api.mchacks.ca'


s = requests.Session()


def requestUntilSuccess(
    string: str,
    invalid_msg: str = 'Invalid input',
    validInput: Callable[[Any], bool] = lambda x: True,
    transformInput: Callable[[str], Any] = lambda x: x
) -> str:
    """
        Requests user input until validInput predicate is satisfied.
        Returns the output of transformInput.
    """
    user_input = None
    while not validInput(user_input):
        print('=====================================')
        user_input = input(string)
        if not validInput(user_input):
            print(invalid_msg)
    return transformInput(user_input)


def login(session=requests.Session()):
    """
    Logs in a user to the inputted session, and returns the session.
    """
    global API_URL
    print("Enter target API")
    user_input = input('Target API (Default {0}): '.format(API_URL))
    if user_input != '':
        API_URL = user_input
    # Get credentials
    print("Enter credentials for", API_URL)
    username = input("Email: ")
    logged_in = False

    while not logged_in:
        password = getpass.getpass("Password: ")
        credentials = {
            'email': username,
            'password': password
        }
        r = session.post('{0}/api/auth/login'.format(API_URL), credentials)
        if r.status_code != 200:
            print("Incorrect password, please try again.")
        else:
            print('Logged in as {0}'.format(username))
            logged_in = True
    return session


def loadIDs() -> List[str]:
    """
    Load the list of IDs provided by user inputted file path.
    """
    # Get information about batch actions
    id_file = requestUntilSuccess(
        'Path to file to MongoIDs: ',
        'Invalid file',
        lambda x: x is not None and os.path.isfile(x) and os.access(x, os.R_OK)
    )

    ids = []
    with open(id_file, 'r') as f:
        rows = f.readlines()
        for index, r in enumerate(rows):
            index = index + 1
            r = r.strip()
            if ObjectId.is_valid(r):
                ids.append(r)
            else:
                print(
                    '({0}/{1}) Error: {2} is not a valid ObjectID'.format(index, len(rows), r))
    # remove duplicates
    ids = list(set(ids))
    return ids


def getDownloadDirectory() -> str:
    directory = requestUntilSuccess(
        'Directory to download files to: ',
        'Invalid directory',
        lambda x: x is not None and os.path.isdir(x) and os.access(x, os.W_OK)
    )
    directory.rstrip('/')
    return directory


def status(prefixStr) -> str:
    status_list = ['{0}: {1}\n'.format(k, v)
                   for k, v in VALID_STATUSES.items()]
    initial_status = requestUntilSuccess(
        'Input {0} status:\n{1}'.format(prefixStr, ''.join(status_list)),
        'Invalid {0} status'.format(prefixStr),
        lambda x: x in VALID_STATUSES.keys(),
        lambda x: VALID_STATUSES[x]
    )
    return initial_status


def batchAction() -> str:
    status_list = ['{0}: {1}\n'.format(k, v) for k, v in BATCH_ACTIONS.items()]
    batch_action = requestUntilSuccess(
        'Batch Action desired:\n{0}'.format(''.join(status_list)),
        'Invalid batch action',
        lambda x: x in BATCH_ACTIONS.keys(),
        lambda x: BATCH_ACTIONS[x]
    )
    return batch_action


def getHacker(ID):
    r1 = s.get('{0}/api/hacker/{1}'.format(API_URL, ID))
    if r1.status_code != 200:
        return None
    else:
        hackerInfo = json.loads(r1.content)['data']
        return hackerInfo


def hasValidStatus(status, hackerInfo):
    if hackerInfo is not None and hackerInfo['status'] == status:
        return True
    else:
        return False


def updateStatus():
    INITIAL_STATUS = status('initial')
    NEW_STATUS = status('new')
    HACKER_IDs = loadIDs()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validStatus = hasValidStatus(INITIAL_STATUS, hacker)
        if validStatus:
            r = s.patch('{0}/api/hacker/status/{1}'.format(API_URL, ID),
                        {"status": NEW_STATUS})
            if r.status_code != 200:
                print(
                    '({0}/{1}) ERROR cannot update status for {2}'.format(index, len(HACKER_IDs), ID))
            else:
                print(
                    '({0}/{1}) {2} {3}'.format(index, len(HACKER_IDs), NEW_STATUS, ID))
        elif hacker is not None:
            print(
                '({0}/{1}) ERROR invalid status for {2}'.format(index, len(HACKER_IDs), ID))
        else:
            print(
                '({0}/{1}) ERROR could not find {2}'.format(index, len(HACKER_IDs), ID))


def sendDayOfEmail():
    INITIAL_STATUS = status('initial')
    HACKER_IDs = loadIDs()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validStatus = hasValidStatus(INITIAL_STATUS, hacker)
        if validStatus:
            r = s.post(
                '{0}/api/hacker/email/dayOf/{1}'.format(API_URL, ID))
            if r.status_code != 200:
                print(
                    '({0}/{1}) ERROR cannot send email to {2}'.format(index, len(HACKER_IDs), ID))
            else:
                print(
                    '({0}/{1}) Sent email to {2}'.format(index, len(HACKER_IDs), ID))
        elif hacker is not None:
            print(
                '({0}/{1}) ERROR invalid status for {2}'.format(index, len(HACKER_IDs), ID))
        else:
            print(
                '({0}/{1}) ERROR could not find {2}'.format(index, len(HACKER_IDs), ID))


def sendWeekOfEmail():
    INITIAL_STATUS = status('initial')
    HACKER_IDs = loadIDs()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validStatus = hasValidStatus(INITIAL_STATUS, hacker)
        if validStatus:
            r = s.post(
                '{0}/api/hacker/email/weekOf/{1}'.format(API_URL, ID))
            if r.status_code != 200:
                print(
                    '({0}/{1}) ERROR cannot send email to {2}'.format(index, len(HACKER_IDs), ID))
            else:
                print(
                    '({0}/{1}) Sent email to {2}'.format(index, len(HACKER_IDs), ID))
        elif hacker is not None:
            print(
                '({0}/{1}) ERROR invalid status for {2}'.format(index, len(HACKER_IDs), ID))
        else:
            print(
                '({0}/{1}) ERROR could not find {2}'.format(index, len(HACKER_IDs), ID))


def downloadResume():
    INITIAL_STATUS = status('initial')
    HACKER_IDs = loadIDs()
    DOWNLOAD_DIR = getDownloadDirectory()

    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validStatus = hasValidStatus(INITIAL_STATUS, hacker)
        if validStatus:
            r = s.get(
                '{0}/api/hacker/resume/{1}'.format(API_URL, ID))
            if r.status_code != 200:
                print(
                    '({0}/{1}) ERROR {2} does not have a resume (Status code {3})'.format(index, len(HACKER_IDs), ID, r.status_code))
            else:
                resume = json.loads(r.content)['data']['resume'][0]['data']
                download_path = "{0}/{1}.pdf".format(DOWNLOAD_DIR, ID)
                with open(download_path, "wb") as fh:
                    byte_data = bytearray(resume)
                    fh.write(byte_data)
                print(
                    '({0}/{1}) Downloaded resume from {2} to {3}'.format(index, len(HACKER_IDs), ID, download_path))
        elif hacker is not None:
            print(
                '({0}/{1}) ERROR invalid status for {2}'.format(index, len(HACKER_IDs), ID))
        else:
            print(
                '({0}/{1}) ERROR could not find {2}'.format(index, len(HACKER_IDs), ID))


if __name__ == "__main__":
    # execute only if run as a script
    login(s)
    while True:
        BATCH_ACTION = batchAction()
        if BATCH_ACTION == 'weekOf':
            sendWeekOfEmail()
        elif BATCH_ACTION == 'dayOf':
            sendDayOfEmail()
        elif BATCH_ACTION == 'updateStatus':
            updateStatus()
        elif BATCH_ACTION == 'downloadResume':
            downloadResume()
        print('Finished {0}'.format(BATCH_ACTION))
