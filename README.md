# TestChat.io

PROBLEM

There isn’t enough communication between Product Owners, Developers and Testers and as a result, Testers often are asked to test a feature when the feature has been deployed to a QA environment and one step from production. This leaves testers feeling rushed and means that automation doesn’t get completed in the same cycle as the development. When automation and testing is an afterthought, more bugs are found in production and they are EXPENSIVE to fix. 

When QA/Dev are separated, stress often develops between QA/Dev. It becomes a war to find bugs and developers feel attacked. If they were communicating earlier and more openly about what and how we are testing, they can think about scenarios and account for them during development. Less bugs making it to testing.

With CI/CD, smaller pieces of work get delivered to production behind feature flags, but a gap exists. Without these crucial conversations around the epic and feature test scenarios, there is often a gap as to understanding if the functional testing or automation has been fully vetted and completed before unveiling flagged features


SOLUTION

TestChat is a conversation enabler for dispersed teams.
- Create groups for epics
- Create cards for stories
- The team provides feedback on test cases within each story card
- The Epic (Group) summarizes all the stories and test cases into a single report
- Chats happen in the comments section of the story card and on each test case
- Everyone gets on the same page with the story, the acceptance criteria and how the testing will be conducted 
- TestChat eliminates yet another meeting to review test cases
- TestChat makes it easier for remote teams that may not be on the same time zone 

FLOW

- PO/QA import stories from Gitlab/Github/Jira as new posts in a group
- QA writes concise high level test cases around the acceptance criteria of the story.
- QA adds dev/PO to the story for feedback
- Dev/PO react to the test cases and give feedback
