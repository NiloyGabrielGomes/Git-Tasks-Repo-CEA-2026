## Git Task 3

### Stream of Consciousness

- Created branch 1 before adding github templates.
- Used git rebase ahead of task 2 to rebase branch 1 to main to fix timeline for the new commits on main.
- Don't know what to add/commit for the 6 unique commits that can also later be squashed down to 3.
   |-> Figured to create a simple calculator app and divide the operations and other functions into 6 commits
- Decided to use the last Git session as inspiration for this task by creating a calculator app.
- Create simple python calc functions for first branch, then a bit more complex functions for second branch, and
  create a simple frontend view for the last branch
- Decided to GUI instead of html for frontend view
- Realized my second branch has 7 commits instead of 6 so have to sqash one extra commit to create 3 commits
  as asked by the task
- Git rebase CLI is tricky and requires VIM everytime (eventhough I know how to use Vim, I still hate using it), 
  looking for alternatives/GUI
- Exploring git kraken as GUI for rebasing
- Found GitLens to be a simplier approach, eventhough isnt as detailed as kraken
- Messed up squashing with GUI and sqashed the wrong commit to the and wrong message, used reflog to go back
- Ran into a merge conflict when rebasing branch 2 with branch 1
- I squashed the commits in branch 1 first and then tried to rebase branch 2 but it shows that the branch 1 commits are still in branch 2 and is creating a conflict.
- Trying to find a solution to this but so far nothing.
- Manually changed heads to resolve conflicts; might have to do the same with branch 3
- Realized I messed up the commit messages during squashing now have to edit those commits and rebase again
- Forgot to rebase branch 3 with branch 2 before squashing the commits of branch 2
- Now have to resolve 13 conflicts of branch 3 rebase manually
- Just realized I don't know how to differentiate between Task 1 and 2 in the given google sheet as the link to the PRs won't show the changes in rebasing.
- 