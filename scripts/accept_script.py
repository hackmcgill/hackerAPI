#!/bin/bash/python3
import base64
from bson import ObjectId
import csv
import getpass
import json
import os
import readline
import requests
import subprocess
from typing import Any, Callable, List
import sys

# Constants
VALID_STATUSES = {
    '1': 'Applied',
    '2': 'Accepted',
    '3': 'Waitlisted',
    '4': 'Declined',
    '5': 'Confirmed',
    '6': 'Withdrawn',
    '7': 'Checked-in'
}
VALID_REVIEWER_STATUSES = {
    '1': 'None',
    '2': 'Poor',
    '3': 'Weak',
    '4': 'Average',
    '5': 'Strong',
    '6': 'Outstanding',
    '7': 'Whitelist'
}
VALID_REVIEWER_NAME = {
    '0': '',
    '1': 'Amy',
    '2': 'Carolyn',
    '3': 'Clara',
    '4': 'Debo',
    '5': 'Deon',
    '6': 'Doaa',
    '7': 'Emily',
    '8': 'Emma',
    '9': 'Ethan',
    '10': 'Evan',
    '11': 'Finnley',
    '12': 'Gabriel',
    '13': 'Ian',
    '14': 'Inaya',
    '15': 'Jake',
    '16': 'Jamie',
    '17': 'Jane J.',
    '18': 'Jane K.',
    '19': 'Jeffrey',
    '20': 'Joshua',
    '21': 'Jyothsna',
    '22': 'Khyati',
    '23': 'Michael',
    '24': 'Mika',
    '25': 'Mubeen',
    '26': 'Mira',
    '27': 'Oishika',
    '28': 'Olivia',
    '29': 'Qi',
    '30': 'Rémi',
    '31': 'Sebastian',
    '32': 'Shirley',
    '33': 'Sihan',
    '34': 'Siva',
    '35': 'Snigdha',
    '36': 'Stephanie',
    '37': 'Tavi',
    '38': 'Tina',
    '39': 'Vipul',
    '40': 'Yue Qian',
}

BATCH_ACTIONS = {
    '1': 'updateStatus',
    '2': 'dayOf',
    '3': 'weekOf',
    '4': 'downloadResume',
    '5': 'inviteUsers',
    '6': 'getHackers',
    '7': 'acceptHackers',
    '8': 'updateReviewerStatus',
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

def reviewerStatus(prefixStr) -> str:
    reviewerStatus_list = ['{0}: {1}\n'.format(k, v)
                   for k, v in VALID_REVIEWER_STATUSES.items()]
    initial_reviewerStatus = requestUntilSuccess(
        'Input {0} reviewerStatus:\n{1}'.format(prefixStr, ''.join(reviewerStatus_list)),
        'Invalid {0} reviewerStatus'.format(prefixStr),
        lambda x: x in VALID_REVIEWER_STATUSES.keys(),
        lambda x: VALID_REVIEWER_STATUSES[x]
    )
    return initial_reviewerStatus

def reviewerStatus2(prefixStr) -> str:
    reviewerStatus2_list = ['{0}: {1}\n'.format(k, v)
                   for k, v in VALID_REVIEWER_STATUSES.items()]
    initial_reviewerStatus2 = requestUntilSuccess(
        'Input {0} reviewerStatus2:\n{1}'.format(prefixStr, ''.join(reviewerStatus2_list)),
        'Invalid {0} reviewerStatus2'.format(prefixStr),
        lambda x: x in VALID_REVIEWER_STATUSES.keys(),
        lambda x: VALID_REVIEWER_STATUSES[x]
    )
    return initial_reviewerStatus2

def reviewerName(prefixStr) -> str:
    reviewerName_list = ['{0}: {1}\n'.format(k, v)
                   for k, v in VALID_REVIEWER_NAME.items()]
    initial_reviewerName = requestUntilSuccess(
        'Input {0} reviewerName:\n{1}'.format(prefixStr, ''.join(reviewerName_list)),
        'Invalid {0} reviewerName'.format(prefixStr),
        # lambda x: x in VALID_REVIEWER_STATUSES.keys(),
        # lambda x: VALID_REVIEWER_STATUSES[x]
    )
    return initial_reviewerName

def reviewerName2(prefixStr) -> str:
    reviewerName2_list = ['{0}: {1}\n'.format(k, v)
                   for k, v in VALID_REVIEWER_NAME.items()]
    initial_reviewerName2 = requestUntilSuccess(
        'Input {0} reviewerName2:\n{1}'.format(prefixStr, ''.join(reviewerName2_list)),
        'Invalid {0} reviewerName2'.format(prefixStr),
        # lambda x: x in VALID_REVIEWER_STATUSES.keys(),
        # lambda x: VALID_REVIEWER_STATUSES[x]
    )
    return initial_reviewerName2

def reviewerComments(prefixStr) -> str:
    reviewerComments_list = ['{0}: {1}\n'.format(k, v)
                   for k, v in str]
    initial_reviewerComments = requestUntilSuccess(
        'Input {0} reviewerComments:\n{1}'.format(prefixStr, ''.join(reviewerComments_list)),
        'Invalid {0} reviewerComments'.format(prefixStr),
        # lambda x: x in VALID_REVIEWER_STATUSES.keys(),
        # lambda x: VALID_REVIEWER_STATUSES[x]
    )
    return initial_reviewerComments

def reviewerComments2(prefixStr) -> str:
    reviewerComments2_list = ['{0}: {1}\n'.format(k, v)
                   for k, v in str]
    initial_reviewerComments2 = requestUntilSuccess(
        'Input {0} reviewerComments2:\n{1}'.format(prefixStr, ''.join(reviewerComments2_list)),
        'Invalid {0} reviewerComments2'.format(prefixStr),
        # lambda x: x in VALID_REVIEWER_STATUSES.keys(),
        # lambda x: VALID_REVIEWER_STATUSES[x]
    )
    return initial_reviewerComments2

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


def hasValidReviewerStatus(reviewerStatus, hackerInfo):
    if hackerInfo is not None and hackerInfo['reviewerStatus'] == reviewerStatus:
        return True
    else:
        return False


def hasValidReviewerStatus2(reviewerStatus2, hackerInfo):
    if hackerInfo is not None and hackerInfo['reviewerStatus2'] == reviewerStatus2:
        return True
    else:
        return False


def hasValidReviewerName(reviewerName, hackerInfo):
    if hackerInfo is not None and hackerInfo['reviewerName'] == reviewerName:
        return True
    else:
        return False


def hasValidReviewerName2(reviewerName2, hackerInfo):
    if hackerInfo is not None and hackerInfo['reviewerName2'] == reviewerName2:
        return True
    else:
        return False


def hasValidReviewerComments(reviewerComments, hackerInfo):
    if hackerInfo is not None and hackerInfo['reviewerComments'] == reviewerComments:
        return True
    else:
        return False


def hasValidReviewerComments2(reviewerComments2, hackerInfo):
    if hackerInfo is not None and hackerInfo['reviewerComments2'] == reviewerComments2:
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

def loadEmails():
    """
    Load the list of emails provided by user inputted file path.
    """
    # Get information about batch actions
    emails_file = requestUntilSuccess(
        'Path to file to Emails: ',
        'Invalid file',
        lambda x: x is not None and os.path.isfile(x) and os.access(x, os.R_OK)
    )

    emails = []
    with open(emails_file, 'r') as f:
        rows = f.readlines()
        for index, r in enumerate(rows):
            index = index + 1
            r = r.strip()
            emails.append(r)
    # remove duplicates
    emails = list(set(emails))
    print(emails)
    return emails

def getIdList():
    list_of_ids = []
    HACKER_EMAILS = loadEmails()
    for index, EMAIL in enumerate(HACKER_EMAILS):
        # so that we aren't 0-based index
        index = index + 1

        a = s.get('{0}/api/hacker/email/{1}'.format(API_URL,EMAIL))
        if a.status_code != 200:
            _print('cannot find hacker for {0}'.format(
                EMAIL), 1, index, len(HACKER_EMAILS))
        else:
            _print('{0} {1}'.format(
                "FOUND HACKER FROM ", EMAIL), 3, index, len(HACKER_EMAILS))
            hacker = json.loads(a.text)
            list_of_ids.append(hacker['data']['id'])
    return list_of_ids

def updateStatus():
    INITIAL_STATUS = status('initial')
    NEW_STATUS = status('new')
    HACKER_IDs = getIdList()
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

def updateReviewerStatus():
    INITIAL_REVIEWER_STATUS = reviewerStatus('initial')
    NEW_REVIEWER_STATUS = reviewerStatus('new')
    HACKER_IDs = getIdList()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validReviewerStatus = hasValidReviewerStatus(INITIAL_REVIEWER_STATUS, hacker)
        if validReviewerStatus:
            r = s.patch('{0}/api/hacker/reviewerStatus/{1}'.format(API_URL, ID),
                        {"reviewerStatus": NEW_REVIEWER_STATUS})
            # if r.status_code != 200:
            #     _print('cannot update status for {0}'.format(
            #         ID), 1, index, len(HACKER_IDs))
            # else:
            _print('{0} {1}'.format(
                NEW_REVIEWER_STATUS, ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))

def updateReviewerStatus2():
    INITIAL_REVIEWER_STATUS2 = reviewerStatus2('initial')
    NEW_REVIEWER_STATUS2 = reviewerStatus2('new')
    HACKER_IDs = getIdList()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validReviewerStatus2 = hasValidReviewerStatus2(INITIAL_REVIEWER_STATUS2, hacker)
        if validReviewerStatus2:
            r = s.patch('{0}/api/hacker/reviewerStatus2/{1}'.format(API_URL, ID),
                        {"reviewerStatus2": NEW_REVIEWER_STATUS2})
            # if r.status_code != 200:
            #     _print('cannot update status for {0}'.format(
            #         ID), 1, index, len(HACKER_IDs))
            # else:
            _print('{0} {1}'.format(
                NEW_REVIEWER_STATUS2, ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))

def updateReviewerName():
    INITIAL_REVIEWER_NAME = reviewerName('initial')
    NEW_REVIEWER_NAME = reviewerName('new')
    HACKER_IDs = getIdList()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validReviewerName = hasValidReviewerName(INITIAL_REVIEWER_NAME, hacker)
        if validReviewerName:
            r = s.patch('{0}/api/hacker/reviewerName/{1}'.format(API_URL, ID),
                        {"reviewerName": NEW_REVIEWER_NAME})
            # if r.status_code != 200:
            #     _print('cannot update status for {0}'.format(
            #         ID), 1, index, len(HACKER_IDs))
            # else:
            _print('{0} {1}'.format(
                NEW_REVIEWER_NAME, ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))

def updateReviewerName2():
    INITIAL_REVIEWER_NAME2 = reviewerName2('initial')
    NEW_REVIEWER_NAME2 = reviewerName2('new')
    HACKER_IDs = getIdList()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validReviewerName2 = hasValidReviewerName2(INITIAL_REVIEWER_NAME2, hacker)
        if validReviewerName2:
            r = s.patch('{0}/api/hacker/reviewerName2/{1}'.format(API_URL, ID),
                        {"reviewerName2": NEW_REVIEWER_NAME2})
            # if r.status_code != 200:
            #     _print('cannot update status for {0}'.format(
            #         ID), 1, index, len(HACKER_IDs))
            # else:
            _print('{0} {1}'.format(
                NEW_REVIEWER_NAME2, ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))

def updateReviewerComments():
    INITIAL_REVIEWER_COMMENTS = reviewerComments('initial')
    NEW_REVIEWER_COMMENTS = reviewerComments('new')
    HACKER_IDs = getIdList()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validReviewerComments = hasValidReviewerComments(INITIAL_REVIEWER_COMMENTS, hacker)
        if validReviewerComments:
            r = s.patch('{0}/api/hacker/reviewerComments/{1}'.format(API_URL, ID),
                        {"reviewerComments": NEW_REVIEWER_COMMENTS})
            # if r.status_code != 200:
            #     _print('cannot update status for {0}'.format(
            #         ID), 1, index, len(HACKER_IDs))
            # else:
            _print('{0} {1}'.format(
                NEW_REVIEWER_COMMENTS, ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))

def updateReviewerComments2():
    INITIAL_REVIEWER_COMMENTS2 = reviewerComments2('initial')
    NEW_REVIEWER_COMMENTS2 = reviewerComments2('new')
    HACKER_IDs = getIdList()
    for index, ID in enumerate(HACKER_IDs):
        # so that we aren't 0-based index
        index = index + 1
        hacker = getHacker(ID)
        validReviewerComments2 = hasValidReviewerComments2(INITIAL_REVIEWER_COMMENTS2, hacker)
        if validReviewerComments2:
            r = s.patch('{0}/api/hacker/reviewerComments/{1}'.format(API_URL, ID),
                        {"reviewerComments": NEW_REVIEWER_COMMENTS2})
            # if r.status_code != 200:
            #     _print('cannot update status for {0}'.format(
            #         ID), 1, index, len(HACKER_IDs))
            # else:
            _print('{0} {1}'.format(
                NEW_REVIEWER_COMMENTS2, ID), 3, index, len(HACKER_IDs))
        elif hacker is not None:
            _print('invalid status for {0}'.format(
                ID), 1, index, len(HACKER_IDs))
        else:
            _print('could not find {0}'.format(
                ID), 1, index, len(HACKER_IDs))

def assignReviewers():
    HACKER_IDs = getIdList()
    numHackers = HACKER_IDs.count
    

# def sendDayOfEmail():
#     INITIAL_STATUS = status('initial')
#     HACKER_IDs = loadIDs()
#     for index, ID in enumerate(HACKER_IDs):
#         # so that we aren't 0-based index
#         index = index + 1
#         hacker = getHacker(ID)
#         validStatus = hasValidStatus(INITIAL_STATUS, hacker)
#         if validStatus:
#             r = s.post(
#                 '{0}/api/hacker/email/dayOf/{1}'.format(API_URL, ID))
#             if r.status_code != 200:
#                 _print('cannot send email to {0}'.format(
#                     ID), 1, index, len(HACKER_IDs))
#             else:
#                 _print('Sent email to {0}'.format(
#                     ID), 3, index, len(HACKER_IDs))
#         elif hacker is not None:
#             _print('Sent invalid status for {0}'.format(
#                 ID), 1, index, len(HACKER_IDs))
#         else:
#             _print('Could not find {0}'.format(
#                 ID), 1, index, len(HACKER_IDs))


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
                'School': result['application']['general']['school'],
                'Degree': result['application']['general']['degree'],
                'Graduation Year': result['application']['general']['graduationYear'],
                'Job Interest': result['application']['general']['jobInterest'],
                'Github': result['application']['general']['URL']['github'],
                'LinkedIn': result['application']['general']['URL']['linkedIn'],
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
            elif BATCH_ACTION == 'acceptHackers':
                acceptFromEmails()
            elif BATCH_ACTION == 'updateReviewerStatus':
                updateReviewerStatus()
            elif BATCH_ACTION == 'updateReviewerStatus2':
                updateReviewerStatus2()
            elif BATCH_ACTION == 'updateReviewerName':
                updateReviewerName()
            elif BATCH_ACTION == 'updateReviewerName2':
                updateReviewerName2()
            elif BATCH_ACTION == 'updateReviewerComments':
                updateReviewerComments()
            elif BATCH_ACTION == 'updateReviewerComments2':
                updateReviewerComments2()
            print('Finished {0}'.format(BATCH_ACTION))
        except Exception as e:
            _print('Failed to perform action {0}: {1}'.format(
                BATCH_ACTION, e), 1)
