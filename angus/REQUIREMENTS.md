Goal of project: Prompt Builder for Legal Tasks

Desired user flow:

- Number of dropdown menus that users can select from
- Based on selections, a prompt will be generated
- The prompt has to be designed in a manner that is compliant with SAL Prompt Engineering Guide
- For now, mock up the LLM processing of all the dropdown menu options to create the "prompt". Deterministically return <built prompt>

*Dropdown menus*

1. What do you want from the AI system?
HEADER: General
- Summarise a document
- Draft communications
- Create a timeline
- Legal research
HEADER: Litigation
- Litigation strategy 
- Draft a court document
HEADER: Corporate 
- Draft a contract
- Review a contract
HEADER: Others
- <free text>

2. What is the deliverable?
[From question 1, the option you pick will give rise to the specific options below]
Summarise a document -> 
- Bullet point list
- One paragraph
- A few paragraphs with headings
- Others <free text>

Draft communication ->
- Email
- Text
- Letter
- Others <free text>

Create a timeline -> 
- Table with dates, key facts, and persons involved
- Others <free text>

Legal research -> 
- Research memo
- Others <free text>

Litigation strategy ->
- Analaysis of similar cases and strategy formulation
- Others <free text>

Draft a court document ->
- Statement of claim
- Defence
- Affidavit
- Others <free text>

Draft a contract ->
- Share purchase agreement
- Asset purchase agreement
- Joint venture agreement
- Employment agreement
- Company constitution 
- Others <free text>

Review a contract ->
- Table of suggested amendments
- Identify red flags or unfavourable contract terms
- Others <free text>

Others -> 
- <free text> Please specify the structure and headings required, if necessary. 

3. What are you preparing this document for?
<free text entry>

4. What information or sources should the AI model use in generating a response? 
<free text>

5.  What is the tone of the document you are preparing?
    - Formal
    - Conversational
    - Plain language
    - Firm but polite
    - Friendly
    - Others