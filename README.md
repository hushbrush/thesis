# Thesis
Thesis project at the MSDV program: 
Exploring the Character Archetypes in Female Characters in Cultural Epics Devoid of Geographic and Time-Specific Context, as a Function of Modelling the 'Ideal' Woman--both in Society and in the minds of women for themselves.


ABSTRACT:

The Archetypes of Female Characters in Literary Epics, and What They Mean for the Expectations from Women in a Culture Over Time, and in the Modern Context

The subject matter of this paper will cover a number of literary epics and the female characters represented in them, and view them through the lens of character archetypes as understood in the modern context. Given that epics contain social history(^1) of a culture, and are considered pieces of art, the concept of art imitates life and life imitates art is explored in order to determine whether the socio-cultural expectations of women stem from ‘role-models’ modelled by the (mostly male) writers of these epics. The idea of how much this affects their internal idea of self is also explored in the latter half through concept of the male gaze in epics.

To do this, the main material treated as ‘data’ will be the text of these epics by themselves, and it will be explored by using machine learning algorithms as well as analyzing some epic text, and the works of scholars on these texts. A model will be developed to explore the ‘proximity’ of different characters to each other in order to better understand the features of a character that give them certain archetypes. I have chosen this topic in order to explore the claims that the events that set off the actions in Ramayana, Mahabharata, Iliad, and many other epics all revolve around female characters. 

The project aims to shed light on the invisible structures that affect the way women view themselves and cater their behavior to.(^2) The final outcome of this project will be a data story created with the help of d3.js and other data visualization techniques, in order to create a discovery tool for these characters.

1: Lefkowitz, Mary R. “The Heroic Women of Greek Epic.” The American Scholar 56, no. 4 (1987): 503–18. http://www.jstor.org/stable/41211464.

2: “Male fantasies, male fantasies, is everything run by male fantasies? Up on a pedestal or down on your knees, it's all a male fantasy: that you're strong enough to take what they dish out, or else too weak to do anything about it. Even pretending you aren't catering to male fantasies is a male fantasy: pretending you're unseen, pretending you have a life of your own, that you can wash your feet and comb your hair unconscious of the ever-present watcher peering through the keyhole, peering through the keyhole in your own head, if nowhere else. You are a woman with a man inside watching a woman. You are your own voyeur.” ― **Margaret Atwood, **The Robber Bride

INTRODUCTION:



"The Historian and the Epic" defines epic
as "essentially a literary crystallisation of the
heroic ideal. By its very nature, therefore, it
is not to be taken as factual evidence, 
but as the representation of an
ideal." (Thapar 199) (^3)

But an ideal is contextualised by when, and where. What similarities will be uncovered when this context is removed? If we looked at the female characters in epics from all over the world, from the lens of today, where do these women fall in terms of the ‘ideal?’ 
This thesis aims to do exactly that, exploring the text of certain epics with the idea of archetypes at the centre of it, and trying to analyse the features of a character that make it a particular archetype. 

The word ‘archetype’ is Greek for ‘first imprint.’ More colloquially, it is used to cluster certain features and decisions made by characters in order to generalise the journey of characters. According to Carl Jung, there are 7 female archetypes- the Mother, the Maiden, the Queen, the Huntress, the Sage, the Mystic, and the Lover. Sita from Ramayana immediately seems to fall under the Mystic, while Kunti from the same falls under the Mother. But is this all that the characters were about? 

Piecing together the cultural extrapolation and power the epics have even today(^3), with the male gaze that is inevitably a part of the epics that are written by men will be addressed. By analysing the construction of female characters in the world of a man, the thesis will explore both the archetypes that emerge as well as how these portrayals shape and reinforce cultural expectations of women. Additionally, it will consider whether these literary ideals influence how women perceive and internalize their own roles within society, and then try to construct a ‘lineage’ of female characters through time and culture. 


While the data visualisation project will aim to deal with characters from several epics, this written thesis will focus on the relationship between a culture and the ‘ideal female characteristics’ through the characters of 3 epics: Mahabharata, Iliad, and The Tale of Genji. It will then focus on understanding the relationship of the female characters with their culture in a qualitative way, while the visualisation project will use the findings of this qualitative function to apply it on a broader scale and uncover ‘proximity’ of different characters from different cultures. Furthermore, it will also look into addressing the best practice to frame such a problem from the perspective of code. This will include a brief outline of the reasoning behind the chosen computational method for determining character proximity, reflecting on both its advantages and the limitations of alternative approaches. Since the nature of the problem makes it susceptible to multicollinearity through the origin of the archetype, methods to avoid this will be theorized. 


3: Romila Thapar: https://indianculturalforum.in/2018/01/17/the-historian-and-the-epic-romila-thapar/
4: RashmiLuthra • 137
Further, I argue that rather than being a dead-end, the epics and
their characters are fertile ground for the enunciation of multiple feminisms
and their various contradictions within the Indian context, and for the creation of common ground between feminists and Indian women at large. 

TREATMENT:
Conceptual Methodology:
To begin with, it is essential to define the scope of what qualifies as ‘epics’ within the context of this project. Traditionally, epics are defined as a heroic poem of great length. However, for the purpose of this paper, the term is expanded to include any piece of literature that captures the cultural zeitgeist of the time, regardless of the literary form. This allows for a more comprehensive set of characters to look into, spanning multiple cultures and historical periods. 
While characters from epics have often been perceived from different lenses throughout history, there are different standards for measuring the character of women and men in epics.(8) Women are considered in the context of, and through the value they create, in the eyes of men. Epics, like any other medium of expression, when written by men, tend to characterise women in the context of men, and their perception of women. This aligns with the concept of The Male Gaze, originally introduced in film theory, which can also be applied to the portrayal of women in epics. By analyzing how female characters are constructed within these narratives, we can uncover underlying gendered characteristics.
Moreover, epics both emerge from(9) and shape(10) the cultures that produce them. While they reflect societal values, they also exert a lasting influence on cultural ideals and norms. This creates a cyclical relationship between art and life: art imitates life, and life imitates art. Hence, there is the implicit assumption that this literature has moulded and modelled the expectation of women in a time and culture. When analyzing female characters across different epics without the immediate context of their cultures, broader patterns begin to emerge—revealing transhistorical and global expectations of women that transcend individual traditions. This study seeks to identify these patterns by constructing and analyzing archetypes of female characters.
Modern discussions of female representation in media, such as the Bechdel Test and the Mako Mori Test, highlight contemporary expectations for female agency in storytelling. These frameworks establish a baseline for evaluating the presence and narrative significance of female characters today. However, the continued discourse around the lack of meaningful representation raises the question—are there archetypical gaps in how women have been historically portrayed? Could this be the result of literature continuously relying on a limited set of female archetypes, reinforcing the same recurring patterns? If certain kinds of female characters seem absent or underdeveloped in modern media, could this be because there is little precedent for them in foundational texts like epics? This study seeks to explore whether gaps in contemporary media arise from the absence of certain archetypes in epics—examining whether the lack of narrative precedent influences which female identities gain representation in modern storytelling.
To facilitate this analysis, the project will develop a dataset comprising at least 200 female characters drawn from a geographically diverse collection of epics. The final visualization will provide insights into the representation, agency, and archetypal significance of these characters across different literary traditions.
While gender is acknowledged as a non-binary spectrum, this paper specifically focuses on the creation and representation of women in epic literature. Hence, characters whose gender identities are ambiguous, non-binary, or male will not be included in the dataset. This decision is not intended to erase these identities, but is to maintain a clear analytical focus and scope for this investigation.

Technical Methodology:
This part of the paper discusses the required data to execute this project, and the methods of creating such a dataset.
The data required for this project spans both qualitative and quantitative aspects, though it is important to note that all data will be derived from the qualitative text of the epics in question. The qualitative nature of the source material plays a crucial role in shaping the method by which the data is extracted and analyzed. First, I will outline the central units of study—specifically the female characters within these epics—before examining existing methods and practices that could facilitate the creation of such a dataset. Finally, I will detail the specific process I plan to follow in order to gather, analyze, and organize the necessary data, ensuring a robust foundation for the subsequent exploration and visualization of these characters.

Central Units of Study:
Female character’s Name
The Epic she appears in
Age
Race/Ethnicity
Year of the Epic
Author
Geographic location 
All the words uttered about her
All the words uttered by her
One line explanation of her character
Main role
Keywords
Characteristics 
Character Archetype

Existing Data:
Existing datasets and methodologies for character analysis often employ machine learning to identify characters, attribute their utterances, and generalize their behavior into single archetypes. One such dataset, CHATTER (11), provides a collection of characters from films, along with their associated tropes and attributes. While this dataset offers valuable training data, its scope is primarily limited to films from the United States over the past century. This temporal range provides historical diversity, but it lacks the necessary geographical breadth required for this study, which focuses on female characters from epics across different cultures. However, beyond its dataset, the theoretical approach underlying CHATTER—its methods for character attribution and trope identification—serves as an important precedent for structuring the methodology of this study. While CHATTER serves as a useful starting point, further adaptation and expansion are required to make it suitable for analyzing the representation of female archetypes in epics.
Additionally, the ProppLearner(12) corpus provides another important precedent for structuring large-scale character analysis, particularly in its use of deep annotation to identify narrative structures. This corpus, developed to analyze Russian folktales, includes eighteen layers of annotation, five of which were specifically designed to capture key elements of Propp’s morphology, such as referent attributes, context relationships, event valences, dramatis personae, and Propp’s functions. The double-annotation paradigm employed in ProppLearner ensures a high level of accuracy and reliability in the categorization of character roles. This level of structured annotation is particularly relevant for this study, as it demonstrates how detailed character taxonomies can be developed and systematically analyzed. Since this study aims to develop a dataset that categorizes female characters in epics, these methods also provide a suitable precedent.
{https://drive.google.com/drive/folders/11egMhs-zkWSASe7zJENwHg17-6VOeXDU}
Technical options for the creation of this dataset:
The first step in creating this dataset is selecting the epics to be included. Since the objective is to analyze female archetypes across cultures, there are no predefined geographic or cultural limitations for the corpus. The selection process will prioritize publicly available English translations to ensure that the data can be processed and visualized in English. However, this introduces a limitation—certain language-specific nuances, cultural connotations, and subtext may be lost in translation.
The process of selecting epics will involve identifying the most widely recognized and culturally significant epics from different regions. Given that historical territorial boundaries do not align with modern national borders, certain areas may have a higher concentration of epics. While some regions may contribute more texts than others, this is not a limitation but a reflection of literary production and preservation patterns over time. The country-based approach serves as a systematic method to ensure the inclusion of widely known and influential epics, though the dataset may not be exhaustive.
Once the corpus is established, the next consideration is selecting which characters will be included in the dataset visualizations. Character archetypes and attributes will be derived from the text, requiring a threshold for inclusion based on word count. This will be determined by a combination of:
Words spoken by the character (direct utterances)
Words spoken about the character (descriptions, references, and discussions by other characters or narrators)
This threshold ensures that there is sufficient textual data to accurately identify and categorize an archetype. The methodology will balance inclusivity with analytical feasibility, ensuring that minor or one-dimensional characters do not skew the dataset while maintaining a comprehensive representation of female archetypes in epic literature.
The extraction of these characters from the text can be done using NER(Named Entity Recognition) in a number of ways:
Natural Language Processing libraries in Python(NLTK, Spacy, Etc.) 
This is a now slightly old method of extracting names, and is expected to work with a low level of accuracy. 
Using an existing AI Chatbot API with a certain amount of code to provide the Name of the text and extract only all the female characters
While this is possibly the easiest to implement, and is expected to provide a fairly accurate output of the central unit of measurement, this can be further improved upon with a third option.
Using AI chatbot along with Fine-Tuning based on a smaller set of characters. The main challenge with this process is that it requires a sample of between 300 and 500 data points.
Manual dataset building.
To optimize both accuracy and efficiency within the project's timeline, a hybrid approach will be employed. First, an NLP-based method will be tested to evaluate its performance and provide initial insights. Following this, an AI chatbot API can be leveraged to generate a sample dataset, utilizing books from the same time period and geographical context as the epics, but not necessarily epics themselves. This supplementary dataset will help address gaps in diversity within the existing datasets. After generating this data, it will be manually parsed to ensure accuracy. Once verified, it will be used to fine-tune a model specifically designed to analyze the texts of the actual epics, extracting characteristics and archetypes. 
The next stage in the dataset creation process involves identifying the characteristics and archetypes that emerge from the textual data. One possible approach would be to establish a predefined set of characteristics and assign a score to each based on deductions from Natural Language Processing (NLP) techniques. However, this method assumes a fixed number of characteristics, potentially leading to data loss by overlooking nuances and emergent traits.
To avoid such limitations, this project operates under the assumption that fictional characters exhibit an unlimited range of characteristics. Therefore, rather than relying on a predefined classification system, this study employs unsupervised machine learning to allow patterns to emerge organically from the data.
Since the goal of this project is categorizing characters into distinct archetypes,  classification provides a structured framework that aligns well with the existing understanding of archetypes in literature, where characters can be grouped based on shared traits, roles, and behaviors. Unlike regression, which focuses on assigning continuous values, classification forces the algorithm to make decisions about which archetype a character best fits into, allowing for clearer and more meaningful categories.
Thereafter, there are the more quantitative column heads that can be deduced by simple tokenization and analysis.
The final Algorithm should be an unsupervised, classification model that leverages and augments existing datasets to adapt to the purpose of this study. Hence, it will take the text of the epic as an input and the dataset including the archetype and character scores for each of the characters as the output.


8: 
In patriarchy, men are classified as good or bad according to their
deeds, whereas women are perceived as good or bad in terms of either their
sexual behaviour or their lack of docility. By this yardstick Draupadi stands
out in the Mahabharata,
Shah, Shalini. “Articulation, Dissent and Subversion: Voices of Women’s Emancipation in Sanskrit Literature.” Social Scientist 45, no. 9/10 (2017): 79–86. http://www.jstor.org/stable/26380457.
9:

interrelation between the
'view of man' and the fictional representation of characters is highlighted. Th

THUMIGER, CHIARA. “HIDDEN PATHS: SELF AND CHARACTERIZATION IN GREEK TRAGEDY: EURIPIDES’ ‘BACCHAE.’” Bulletin of the Institute of Classical Studies. Supplement, no. 99 (2007): iv–266. http://www.jstor.org/stable/43768149.

10:
Epics are not merely entertaining stories; they serve as cultural touchstones that reflect
the values, beliefs, and aspirations of the societies from which they originate. These
narratives often incorporate historical events, mythological elements, and moral lessons.
For instance, "The Iliad" offers profound insights into the nature of honor and the cost of
war, while "The Epic of Gilgamesh" explores the search for immortality and the meaning
of life.
B. The
Farzand, Mariyam. 2023. Epic Literature and the Significance of Epic Heroes in Literature.
11:
Baruah, Sabyasachee, and Shrikanth Narayanan. CHATTER: A Character Attribution Dataset for Narrative Understanding. Signal Analysis & Interpretation Laboratory, University of Southern California.

12:
Finlayson, Mark A. ProppLearner: Deeply Annotating a Corpus of Russian Folktales to Enable the Machine Learning of a Russian Formalist Theory. Florida International University, Miami, FL, USA.


SKETCHES:
[ThesisSketches01_Harshita.pdf](https://github.com/user-attachments/files/19013934/ThesisSketches01_Harshita.pdf)

<img width="1280" alt="Screenshot 2025-03-06 at 12 16 59 PM" src="https://github.com/user-attachments/assets/5f26b02e-9d65-431a-add6-e3e6b7bc47cc" />


MOCKUP: 

https://www.figma.com/proto/zquAjemdk4GgVoW69NVKOo/thesis-1a?node-id=5-756&p=f&t=0NPYAfui6LfSmR6R-1&scaling=scale-down&content-scaling=fixed&page-id=1%3A2


![1](https://github.com/user-attachments/assets/e3d6e39e-78d7-4f9f-8039-2c31fd258285)
![2](https://github.com/user-attachments/assets/aff90f51-4e9d-4349-8089-6f9b74e252b5)
![3](https://github.com/user-attachments/assets/d5babd20-8044-41f5-8476-62711a729e70)
![4](https://github.com/user-attachments/assets/e07664e2-fd43-4a9d-98dd-1180bf2f5571)
![5](https://github.com/user-attachments/assets/bfeb59b2-6380-4a00-89b6-bac3cd25c813)
![6](https://github.com/user-attachments/assets/7d2c1310-ee5d-4898-b6cc-ddbf0fcfdd9a)
![7](https://github.com/user-attachments/assets/16e61675-935c-4ec8-851a-568d20b451d9)
~ needs another version of the archetype distrubution, based on the characteristics assessed here ~
![8](https://github.com/user-attachments/assets/4a7f88c4-558e-4100-b7db-39d0300d5b54)
























LITERATURE REVIEW: 

Momsen, Janet Henshall, and Janet G. Townsend. Geography of gender in the third world. Albany, N.Y: State University of New York Press, 1987. 
Dixon, Laurinda S. Perilous chastity: Women and illness in pre-enlightenment art and medicine. Ithaca, NY: Cornell University Press, 2019. 

Dimitrakaki, Angela. Gender, artwork and the Global Imperative: A Materialist Feminist Critique. Manchester: Manchester University Press, 2016. 



ALABANZA, TRAVIS. Many voices: Gender. S.l.: TATE PUBLISHING, 2021. 

Vera-Gray, F. The right amount of panic: How women trade freedom for safety. Bristol: Policy Press, 2023. 

Bates, Laura. Everyday sexism. New York: Thomas Dunne Books, St. Martin’s Griffin, 2016. 





WaliKhanna, Charu. Sita Returns: Modern India through her eyes. New Delhi, India: Paper Missile/Niyogi Books, 2018. 


