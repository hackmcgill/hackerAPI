#!/bin/bash/python3
import base64
from bson import ObjectId
import csv
import getpass
import json
import os
import requests
import subprocess
from typing import Any, Callable, List
import sys

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
    '4': 'downloadResume',
    '5': 'inviteUsers',
    '6': 'getHackers'
}
LOG_VERBOSITIES = {
    '0': 'None',
    '1': 'Error',
    '2': 'Warning',
    '3': 'Info'
}

CHOSEN_VERBOSITY = 3


API_URL = 'https://api.mchacks.ca'


s = requests.Session()


def _print(msg, msgType=3, index=None, total=None):
    """
    Wrapper around print function such that we only print to the granularity that the user wants.
    Also, allow for formatting of sequential print statements ex: (10/114)
    """
    global CHOSEN_VERBOSITY
    if msgType <= CHOSEN_VERBOSITY:
        out_file = sys.stdout if msgType > 1 else sys.stderr
        if index is None or total is None:
            print('{0}: {1}'.format(
                LOG_VERBOSITIES[str(msgType)], msg), file=out_file)
        else:
            print('({0}/{1}) {2}: {3}'.format(index, total,
                                              LOG_VERBOSITIES[str(msgType)], msg), file=out_file)


def requestUntilSuccess(
    string: str,
    invalid_msg: str = 'Invalid input',
    validInput: Callable[[Any], bool] = lambda x: x is not None,
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
    user_input = requestUntilSuccess(
        'Enter Target API (Default {0}): '.format(API_URL))
    if user_input != '':
        API_URL = user_input
    # Get credentials
    username = requestUntilSuccess(
        'Enter credentials for {0}: '.format(API_URL))
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


def chooseLogVerbosity():
    global CHOSEN_VERBOSITY
    verbosity_list = ['{0}: {1}\n'.format(k, v)
                      for k, v in LOG_VERBOSITIES.items()]
    chosen_verbosity = requestUntilSuccess(
        'Input log verbosity (default {0}):\n{1}'.format(
            CHOSEN_VERBOSITY, ''.join(verbosity_list)),
        'Invalid verbosity',
        lambda x: x == '' or x in LOG_VERBOSITIES.keys(),
        lambda x: CHOSEN_VERBOSITY if x == '' else int(x)
    )
    CHOSEN_VERBOSITY = chosen_verbosity


def loadInvites() -> List[str]:
    """
    Load the list of invites provided by user inputted file path.
    """
    # Get information about batch actions
    invite_file = requestUntilSuccess(
        'Path to Invite CSV: ',
        'Invalid file',
        lambda x: x is not None and os.path.isfile(x) and os.access(x, os.R_OK)
    )

    invites = []
    with open(invite_file, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        index = 1
        for row in reader:
            index = index + 1
            email = row['email']
            accountType = row['accountType']
            if email is not None and accountType is not None:
                invites.append({
                    'email': email,
                    'accountType': accountType
                })
            else:
                _print('{2} is not a valid invite format'.format(
                    row), 1, index, len(reader))
    return invites


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
                _print('{2} is not a valid ObjectID'.format(
                    r), 1, index, len(rows))
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
    r = s.get('{0}/api/hacker/{1}'.format(API_URL, ID))
    if r.status_code != 200:
        return None
    else:
        hackerInfo = json.loads(r.content)['data']
        return hackerInfo


def hasValidStatus(status, hackerInfo):
    if hackerInfo is not None and hackerInfo['status'] == status:
        return True
    else:
        return False


def search(model: str = 'hacker', query=[], expand: bool = True):
    q = json.dumps(query)
    expand = 'true' if expand else 'false'
    r = s.get(
        '{0}/api/search?model={1}&q={2}&expand={3}'.format(API_URL, model, q, expand))
    if r.status_code != 200:
        _print('Could not perform search (Status code {0})'.format(
            r.status_code), 1)
        return []
    else:
        results = json.loads(r.content)['data']
        return results


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
                _print('cannot update status for {0}'.format(
                    ID), 1, index, len(HACKER_IDs))
            else:
                _print('{0} {1}'.format(
                    NEW_STATUS, ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))


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
                _print('cannot send email to {0}'.format(
                    ID), 1, index, len(HACKER_IDs))
            else:
                _print('Sent email to {0}'.format(
                    ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('Sent invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('Could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))


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
                _print('Cannot send email to {0}'.format(
                    ID), 1, index, len(HACKER_IDs))
            else:
                _print('Sent email to {0}'.format(
                    ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('Invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('Could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))


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
                _print('Could not find resume for {0}'.format(
                    ID), 1, index, len(HACKER_IDs))
            else:
                resume = json.loads(r.content)['data']['resume'][0]['data']
                download_path = "{0}/{1}.pdf".format(DOWNLOAD_DIR, ID)
                with open(download_path, "wb") as fh:
                    byte_data = bytearray(resume)
                    fh.write(byte_data)
                _print('Downloaded resume for {0} to {1}'.format(
                    ID, download_path), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 3, index, len(HACKER_IDs))
        else:
            _print('Could not find hacker {0}'.format(
                ID), 1, index, len(HACKER_IDs))


def inviteUsers():
    INVITES = loadInvites()
    for index, invite in enumerate(INVITES):
        index = index + 1
        r = s.post(
            '{0}/api/account/invite/'.format(API_URL), invite)
        if r.status_code != 200:
            _print('Could not invite {0}, {1}'.format(
                invite['email'], invite['accountType']), 1, index, len(INVITES))
        else:
            _print('Invited {0}, {1}'.format(
                invite['email'], invite['accountType']), 3, index, len(INVITES))


def getHackers():
    CUR_STATUS = status('current')
    DOWNLOAD_DIR = getDownloadDirectory()
    results = search(
        'hacker',
        [{'param': 'status', 'operation': 'equals', 'value': CUR_STATUS}]
    )
    with open('{0}/hackerIDs_{1}.csv'.format(DOWNLOAD_DIR, CUR_STATUS), 'w') as out_file:
        fieldnames = [
            'id',
            'First Name',
            'Last Name',
            'Email',
            'School',
            'Degree',
            'Graduation Year',
            'Job Interest',
            'Github',
            'LinkedIn'
        ]
        csv_writer = csv.DictWriter(out_file, fieldnames=fieldnames)
        csv_writer.writeheader()
        for result in results:
            csv_writer.writerow({
                'id': result['id'],
                'First Name': result['accountId']['firstName'],
                'Last Name': result['accountId']['lastName'],
                'Email': result['accountId']['email'],
                'School': result['school'],
                'Degree': result['degree'],
                'Graduation Year': result['graduationYear'],
                'Job Interest': result['application']['jobInterest'],
                'Github': result['application']['portfolioURL']['github'],
                'LinkedIn': result['application']['portfolioURL']['linkedIn'],
            })


if __name__ == "__main__":
    # execute only if run as a script
    chooseLogVerbosity()
    login(s)
    while True:
        BATCH_ACTION = batchAction()
        try:
            if BATCH_ACTION == 'weekOf':
                sendWeekOfEmail()
            elif BATCH_ACTION == 'dayOf':
                sendDayOfEmail()
            elif BATCH_ACTION == 'updateStatus':
                updateStatus()
            elif BATCH_ACTION == 'downloadResume':
                downloadResume()
            elif BATCH_ACTION == 'inviteUsers':
                inviteUsers()
            elif BATCH_ACTION == 'getHackers':
                getHackers()
            print('Finished {0}'.format(BATCH_ACTION))
        except Exception as e:
            _print('Failed to perform action {0}: {1}'.format(
                BATCH_ACTION, e), 1)
