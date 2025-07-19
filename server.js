const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

// Curated list of Bible verses by theme
const bibleVersesByTheme = {
    "Patience": [
        "Romans 8:25 - But if we hope for what we do not yet have, we wait for it patiently.",
        "Psalm 37:7 - Be still before the Lord and wait patiently for him; do not fret when people succeed in their ways, when they carry out their wicked schemes.",
        "James 1:4 - Let perseverance finish its work so that you may be mature and complete, not lacking anything.",
        "Galatians 6:9 - Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
        "Hebrews 10:36 - You need to persevere so that when you have done the will of God, you will receive what he has promised."
    ],
    "Forgiveness": [
        "Colossians 3:13 - Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
        "Matthew 6:14-15 - For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
        "Ephesians 4:32 - Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
        "Luke 17:3-4 - If your brother or sister sins against you, rebuke them; and if they repent, forgive them. Even if they sin against you seven times in a day and seven times come back to you saying ‘I repent,’ you must forgive them.",
        "Mark 11:25 - And when you stand praying, if you hold anything against anyone, forgive them, so that your Father in heaven may forgive you your sins."
    ],
    "Leadership": [
        "Proverbs 11:14 - For lack of guidance a nation falls, but victory is won through many advisers.",
        "1 Peter 5:2-3 - Be shepherds of God’s flock that is under your care, watching over them—not because you must, but because you are willing, as God wants you to be; not pursuing dishonest gain, but eager to serve; not lording it over those entrusted to you, but being examples to the flock.",
        "Matthew 20:26-28 - Not so with you. Instead, whoever wants to become great among you must be your servant, and whoever wants to be first among you must be your slave— just as the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
        "Joshua 1:9 - Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        "Romans 12:8 - if it is to lead, do it diligently; if it is to show mercy, do it cheerfully."
    ],
    "Hope": [
        "Jeremiah 29:11 - For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.",
        "Romans 15:13 - May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
        "Psalm 62:5-6 - Yes, my soul, find rest in God; my hope comes from him. Truly he is my rock and my salvation; he is my fortress, I will not be shaken.",
        "Hebrews 11:1 - Now faith is confidence in what we hope for and assurance about what we do not see.",
        "Lamentations 3:21-24 - Yet this I call to mind and therefore I have hope: Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness. I say to myself, “The Lord is my portion; therefore I will wait for him.”"
    ],
    "Love": [
        "1 Corinthians 13:4-7 - Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
        "John 3:16 - For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        "Romans 5:8 - But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
        "1 John 4:7-8 - Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God. Whoever does not love does not know God, because God is love.",
        "Colossians 3:14 - And over all these virtues put on love, which binds them all together in perfect unity."
    ],
    "Faith": [
        "Hebrews 11:1 - Now faith is confidence in what we hope for and assurance about what we do not see.",
        "Romans 10:17 - Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.",
        "James 2:17 - In the same way, faith by itself, if it is not accompanied by action, is dead.",
        "2 Corinthians 5:7 - For we live by faith, not by sight.",
        "Matthew 17:20 - He replied, “Because you have so little faith. Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, ‘Move from here to there,’ and it will move. Nothing will be impossible for you.”"
    ],
    "Gratitude": [
        "1 Thessalonians 5:18 - give thanks in all circumstances; for this is God’s will for you in Christ Jesus.",
        "Psalm 107:1 - Give thanks to the Lord, for he is good; his love endures forever.",
        "Colossians 3:17 - And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus, giving thanks to God the Father through him.",
        "Philippians 4:6 - Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        "Psalm 100:4 - Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name."
    ],
    "Courage": [
        "Joshua 1:9 - Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        "Deuteronomy 31:6 - Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.",
        "Psalm 27:1 - The Lord is my light and my salvation— whom shall I fear? The Lord is the stronghold of my life— of whom shall I be afraid?",
        "Isaiah 41:10 - So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
        "Philippians 4:13 - I can do all this through him who gives me strength."
    ],
    "Wisdom": [
        "Proverbs 3:5-6 - Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        "James 1:5 - If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
        "Proverbs 4:6-7 - Do not forsake wisdom, and she will protect you; love her, and she will watch over you. The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.",
        "Ecclesiastes 7:12 - Wisdom is a shelter as money is a shelter, but the advantage of knowledge is this: Wisdom preserves the life of its possessor.",
        "Proverbs 9:10 - The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding."
    ],
    "Joy": [
        "Psalm 16:11 - You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.",
        "Philippians 4:4 - Rejoice in the Lord always. I will say it again: Rejoice!",
        "Nehemiah 8:10 - Nehemiah said, “Go and enjoy your rich food and sweet drinks, and send some to those who have nothing prepared. This day is holy to our Lord. Do not grieve, for the joy of the Lord is your strength.”",
        "Romans 15:13 - May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
        "John 15:11 - I have told you this so that my joy may be in you and that your joy may be complete."
    ],
    "Kindness": [
        "Ephesians 4:32 - Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
        "Proverbs 11:17 - A kind person benefits themselves, but a cruel person brings trouble on themselves.",
        "Colossians 3:12 - Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
        "Galatians 5:22-23 - But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
        "Luke 6:35 - But love your enemies, do good to them, and lend to them without expecting to get anything back. Then your reward will be great, and you will be children of the Most High, because he is kind to the ungrateful and wicked."
    ],
    "Humility": [
        "Philippians 2:3-4 - Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.",
        "Proverbs 22:4 - Humility is the fear of the Lord; its wages are riches and honor and life.",
        "James 4:10 - Humble yourselves before the Lord, and he will lift you up.",
        "1 Peter 5:5-6 - In the same way, you who are younger, submit yourselves to your elders. All of you, clothe yourselves with humility toward one another, because, “God opposes the proud but shows favor to the humble.” Humble yourselves, therefore, under God’s mighty hand, that he may lift you up in due time.",
        "Micah 6:8 - He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God."
    ]
};

function getRandomVerses(theme, count = 2) {
    const verses = bibleVersesByTheme[theme];
    if (!verses || verses.length === 0) {
        return [];
    }
    const shuffled = [...verses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); // Serve static files

// Add a route for the root path to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'devotional_generator.html'));
});

app.post('/api/generate', async (req, res) => {
    console.log('Received request to /api/generate');
    try {
        const { selectedTheme, selectedAudience, selectedMood } = req.body;

        if (!selectedTheme) {
            return res.status(400).json({ error: 'Theme is required.' });
        }

        const selectedVerses = getRandomVerses(selectedTheme, 2); // Get 2 random verses
        const verseText = selectedVerses.length > 0 ? '\n\nScripture for reflection:\n' + selectedVerses.join('\n') : '';

        let prompt = `Generate a short devotional (200-300 words) on the theme of "${selectedTheme}".`;

        if (selectedAudience) {
            prompt += ` It should be tailored for a "${selectedAudience}" audience.`;
        }
        if (selectedMood) {
            prompt += ` The devotional should also consider a mood of "${selectedMood}".`;
        }

        prompt += `${verseText}\n\nIt must include:\n1. A concise title (3-6 words) for the devotional.\n2. An introductory thought on the theme.\n3. The provided Bible verses (with chapter and verse numbers, e.g., John 3:16) in the Scripture section.\n4. A brief reflection or practical application of the theme from a biblical perspective, specifically referencing the provided verses.\n5. An actionable and engaging "Today's Challenge".\n6. A short concluding prayer.\nPlease format your response with clear headings for each section: "Concise Title (3-6 words):", "Introductory Thought:", "Scripture:", "Reflection:", "Prayer:", "Today's Challenge:". Do not use any Markdown formatting like bold (**), italics (*), or headings (###) within the content of each section.`;

        console.log('Attempting to get API key...');
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('API key not configured on the server (inside /api/generate).');
            return res.status(500).json({ error: 'API key not configured on the server.' });
        }
        console.log('API key found. Constructing API URL...');
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        console.log('Making request to Gemini API...');
        const geminiPayload = { contents: [{ parts: [{ text: prompt }] }] };
        console.log('Payload being sent to Gemini API:', JSON.stringify(geminiPayload, null, 2));
        const response = await axios.post(apiUrl, geminiPayload, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Received response from Gemini API.');
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to Gemini API:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Failed to fetch from Gemini API' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
