## Git Reflog

```
Craftsmen@DESKTOP-9353II7 MINGW64 /e/Git-Tasks-Repo-CEA-2026 (recovered_commit/old)
$ git reflog 
2b73678 (HEAD -> recovered_commit/old, origin/recovered_commit/old) HEAD@{0}: checkout: moving from restored_branch/new to recovered_commit/old
63723b4 (origin/restored_branch/new, restored_branch/new) HEAD@{1}: checkout: moving from recovered_commit/old t
o restored_branch/new
2b73678 (HEAD -> recovered_commit/old, origin/recovered_commit/old) HEAD@{2}: checkout: moving from restored_branch/new to recovered_commit/old
63723b4 (origin/restored_branch/new, restored_branch/new) HEAD@{3}: checkout: moving from feat/Tasklogs to restored_branch/new
65ee198 (origin/feat/Tasklogs, feat/Tasklogs) HEAD@{4}: checkout: moving from temp_branch/delete to feat/Tasklog
s
2b73678 (HEAD -> recovered_commit/old, origin/recovered_commit/old) HEAD@{5}: checkout: moving from feat/Tasklog
s to temp_branch/delete
65ee198 (origin/feat/Tasklogs, feat/Tasklogs) HEAD@{6}: checkout: moving from temp_branch/delete to feat/Tasklogs
2b73678 (HEAD -> recovered_commit/old, origin/recovered_commit/old) HEAD@{7}: commit: deleted branches' last commit
bc486d9 HEAD@{8}: commit: second commit of to be deleted branch
760c54e HEAD@{9}: reset: moving to HEAD~
63723b4 (origin/restored_branch/new, restored_branch/new) HEAD@{10}: commit: second commit of to be deleted branch
760c54e HEAD@{11}: commit: first commit of to be deleted branch
65ee198 (origin/feat/Tasklogs, feat/Tasklogs) HEAD@{12}: reset: moving to HEAD~
1879b37 HEAD@{13}: commit: first commit of to be deleted branch
65ee198 (origin/feat/Tasklogs, feat/Tasklogs) HEAD@{14}: checkout: moving from feat/Tasklogs to temp_branch/delete
65ee198 (origin/feat/Tasklogs, feat/Tasklogs) HEAD@{15}: checkout: moving from main to feat/Tasklogs
```