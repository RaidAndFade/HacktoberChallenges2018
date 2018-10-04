# Thanks to NCPlayz (https://github.com/NCPlayz) for help creating this script

import os
import requests
from unidiff import PatchSet
from datetime import datetime


#this should be an env var but i use this script on more than one device so it's just a pain to make it an envvar
API_AUTH = ()
REPO_URL = "https://api.github.com/repos/RaidAndFade/Hacktoberfest2018/pulls"
RAIDANDFADE_ID = 5139165
HAZARDOUS_TAGS = ("script","style","meta","iframe","img","video","audio","link","svg")

class PRChecker:
    def __init__(self, pr_info: dict):
        self.pr_info = pr_info

        self._attentions = []
        self._invalids = []

        self.attention_required = False
        self.invalid = False

        #vars to be declared later (this is so that pylint doesnt cry)
        self.number = None
        self.title = None
        self.url = None
        self.author = None
        self.invalid_reasons = []
        self.attention_reasons = []

        res = self.interpret_pr()

        for attr in res.keys():
            setattr(self, attr, res[attr])

    def add_attention(self, reason: str):
        self._attentions.append(reason)

        if not self.attention_required:
            self.attention_required = True

    def add_invalid(self, reason: str):
        self._invalids.append(reason)

        if not self.invalid:
            self.invalid = True

    def interpret_pr(self):
        new_file = self.check_diff()

        if new_file is not None:

            uname = self.pr_info['user']['login']

            path = os.path.split(new_file['diff'][0].path)


            if f'{uname}.html'.lower() != path[1].lower():
                self.add_invalid(f'Your filename must be `{uname}.html`')
            
            if path[0] != "Friends":
                self.add_invalid(f'Your file is not in the `Friends` folder.')

            if path[1].lower().endswith('.html'):

                valid_urls = (f"https://www.github.com/{uname}",f"https://github.com/{uname}",
                                f"http://github.com/{uname}",f"http://www.github.com/{uname}")
                has_url = False

                for l in valid_urls:
                    if l.lower() in new_file['lines']:
                        has_url = True
                        break
                
                if not has_url:
                    print("has ")
                    self.add_invalid('Your file does not clearly show a link to your github profile.')

                needs_review = False

                for h in HAZARDOUS_TAGS:
                    if ("<"+h.lower()) in new_file['lines']:
                        needs_review = True
                        break

                if needs_review:
                    self.add_attention('This contains potentially hazardous tags that need manual review.')

            else:
                self.add_invalid('Your file does not have the `.html` extension.')

        result = {
            'number': self.pr_info['number'],
            'title': self.pr_info['title'],
            'url': self.pr_info['url'],
            'author': self.pr_info['user']['login'],
        }

        if len(self._invalids) > 0:
            result['invalid_reasons'] = self._invalids

        if len(self._attentions) > 0:
            result['attention_reasons'] = self._attentions

        return result

    def check_diff(self):
        diff_file = requests.get(self.pr_info['diff_url'], auth=API_AUTH).text
        diff = PatchSet(diff_file)

        fcount = diff_file.count("diff --git")

        if fcount > 1:
            self.add_invalid('More than one file has been added/removed/modified.')
            return
        elif fcount < 1:
            self.add_invalid('Less than one file has been added/removed/modified.')
            return
        elif diff[0].is_modified_file:
            self.add_attention('This file has modifies a pre-existing file.')
            return

        new_file = self.parse_diff(str(diff[0]).split('\n'))

        return {'lines': new_file, 'diff': diff}

    def parse_diff(self, diff: list):
        new_file_lines = ""
        for line in diff:
            if line.startswith('+') and not line.startswith('+++'):
                new_file_lines += f"{line[1:]}\n".lower()

        return new_file_lines

def has_label(pr,lblname):
    for lbl in pr['labels']:
        if lbl['name'] == lblname:
            return True
    return False
def do_merge(pr):
    #sha = sha that head must match... i did this manually, but it would have been cool to use the built-in api
    #PUT /repos/:owner/:repo/pulls/:number/merge
    merge_r = requests.put(pr['url']+"/merge",auth=API_AUTH,json={"commit_title":"Auto-Merging PR#"+str(pr['number']),"commit_message":"Automatically merged PR#"+str(pr['number'])+" as it seemed safe."})
    if 'message' in merge_r:
        print(merge_r)
def add_label(pr,lblname):
    #return
    addl_r = requests.post(pr['issue_url']+"/labels",auth=API_AUTH,json=[lblname]).json()
    if 'message' in addl_r:
        print(addl_r)
def remove_label(pr,lblname):
    #return
    rml_r = requests.delete(pr['issue_url']+"/labels/"+lblname,auth=API_AUTH).json()
    if 'message' in rml_r:
        print(rml_r)
def send_comment(pr,msg):
    msg += "\n\n***This is an automated response, beep boop.\nif you think there is a mistake, contact a maintainer***"
    msg += "\n> "+pr['head']['sha']
    print(msg)
    #return
    mr = requests.post(pr['comments_url'],auth=API_AUTH,json={'body':msg}).json()
    if 'message' in mr:
        print(mr)

def get_most_recent_bot_comment(pr,cmlist):
    comments = list(cmlist)
    comments.reverse()
    for c in comments:
        if c['user']['id'] == RAIDANDFADE_ID:
            bdy = c['body'].replace("\r","").split('\n')
            if bdy[-1][:2] == "> ":
                return c
    return None

def get_bot_checked_sha(c):
    if c is not None:
        bdy = c['body'].replace("\r","").split('\n')
        return bdy[-1][2:]
    return None

if __name__ == '__main__':
    r = requests.get(REPO_URL, auth=API_AUTH)
    for i in r.json():
        if i['state'] == 'open':
            comment = ""
            
            if len(i['labels']) > 0:
                prcomments = requests.get(i['comments_url'], auth=API_AUTH).json()
                last_bot_comment = get_most_recent_bot_comment(i,prcomments)
                last_check = get_bot_checked_sha(last_bot_comment)
                if last_check == i['head']['sha']:
                    continue

            #these need to be checked/merged by humans, don't bother unless something changes
            if has_label(i,"attention") or has_label(i,"checked"): 
                if not (last_check == i['head']['sha']):
                    msgtime = datetime.strptime(last_bot_comment['created_at'],"%Y-%m-%dT%H:%M:%SZ")
                    curtime = datetime.utcnow()
                    timediff = (curtime-msgtime).total_seconds()
                    if timediff < 3600: # if its been less than an hour since last comment
                        continue
                    comment += "This request's code has changed since approval. Re-Judging contents...\n"
            
            if has_label(i,"needs work"):
                # if the api hasnt properly updated yet, continue
                # is the last comment still by the bot? if so, don't re-check
                if len(prcomments) > 0: # how the fuck can it be <0 other than someone just doing an invalid tag for fuck-all
                    if prcomments[-1]['id'] == last_bot_comment['id']:
                        print(i['number'],"has changed, but is marked invalid and has not been responded to, Skipping")
                        continue
                
            pr = PRChecker(i)

            if pr.invalid: # the pr contains a mistake, and is invalid
                print(f"\nPull Request #{pr.number} has {len(pr.invalid_reasons)} Invalid Reason(s):\n")
                reasons = ""
                rc = 1
                for r in pr.invalid_reasons:
                    reasons += f"\n{rc}. {r}"
                    rc += 1 
                
                comment += "Your pull request needs further work because of the following reason(s):"
                comment += reasons
                comment += "\n\nOnce you have resolved the issues, **comment on this request to be re-judged**"
                if has_label(i,"autochecked"):
                    remove_label(i,"autochecked")
                if has_label(i,"attention"):
                    remove_label(i,"attention")
                send_comment(i,comment)
                if not has_label(i,"needs work"):
                    add_label(i,"needs work")
            elif pr.attention_required: #something is wrong and the pr needs manual approval
                print(f"\nPull Request #{pr.number} has {len(pr.attention_reasons)} Attention Reason(s):\n")
                reasons = ""
                rc = 1
                for r in pr.attention_reasons:
                    reasons += f"\n{rc}. {r}"
                    rc += 1 
                
                comment += "Your pull request seems good, but must be checked by a human maintainer for the following reason(s):"
                comment += reasons
                comment += "\n\nPlease be patient until a maintainer has time to look over your contribution."
                if has_label(i,"autochecked"):
                    remove_label(i,"autochecked")
                if has_label(i,"needs work"):
                    remove_label(i,"needs work")
                send_comment(i,comment)
                if not has_label(i,"attention"):
                    add_label(i,"attention")
            else: # the pr looks good and can be merged by a maintainer
                if has_label(i,"needs work"):
                    remove_label(i,"needs work")
                if has_label(i,"attention"):
                    remove_label(i,"attention")
                if not has_label(i,"autochecked"):
                    add_label(i,"autochecked")
        
                comment += "Your pull request looks good, and is ready for merging!"
                comment += "\n\nThank you for being a part of Open Source, I hope you continue to help other repositories in the future!"
                send_comment(i,comment)
                do_merge(i)