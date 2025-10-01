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
        "Hebrews 10:36 - You need to persevere so that when you have done the will of God, you will receive what he has promised.",
        "Psalm 40:1 - I waited patiently for the Lord; he turned to me and heard my cry.",
        "Lamentations 3:25 - The Lord is good to those whose hope is in him, to the one who seeks him;",
        "Isaiah 40:31 - but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        "Romans 12:12 - Be joyful in hope, patient in affliction, faithful in prayer.",
        "James 5:7-8 - Be patient, then, brothers and sisters, until the Lord’s coming. See how the farmer waits for the land to yield its valuable crop, patiently waiting for the autumn and spring rains. You too, be patient and stand firm, because the Lord’s coming is near.",
        "Proverbs 15:18 - A hot-tempered person stirs up conflict, but the one who is patient calms a quarrel.",
        "Ecclesiastes 7:8 - The end of a matter is better than its beginning, and patience is better than pride.",
        "1 Timothy 6:11 - But you, man of God, flee from all this and pursue righteousness, godliness, faith, love, endurance and gentleness.",
        "2 Peter 3:9 - The Lord is not slow in keeping his promise, as some understand slowness. Instead he is patient with you, not wanting anyone to perish, but everyone to come to repentance.",
        "Colossians 1:11 - being strengthened with all power according to his glorious might so that you may have great endurance and patience,"
    ],
    "Forgiveness": [
        "Colossians 3:13 - Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
        "Matthew 6:14-15 - For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
        "Ephesians 4:32 - Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
        "Luke 17:3-4 - If your brother or sister sins against you, rebuke them; and if they repent, forgive them. Even if they sin against you seven times in a day and seven times come back to you saying ‘I repent,’ you must forgive them.",
        "Mark 11:25 - And when you stand praying, if you hold anything against anyone, forgive them, so that your Father in heaven may forgive your sins.",
        "Psalm 103:12 - as far as the east is from the west, so far has he removed our transgressions from us.",
        "Acts 2:38 - Peter replied, “Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins. And you will receive the gift of the Holy Spirit.",
        "1 John 1:9 - If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",
        "Matthew 18:21-22 - Then Peter came to Jesus and asked, “Lord, how many times shall I forgive my brother or sister who sins against me? Up to seven times?” Jesus answered, “I tell you, not seven times, but seventy-seven times.",
        "Daniel 9:9 - The Lord our God is merciful and forgiving, even though we have rebelled against him.",
        "Luke 6:37 - “Do not judge, and you will not be judged. Do not condemn, and you will not be condemned. Forgive, and you will be forgiven.",
        "2 Corinthians 2:7 - Now instead, you ought to forgive and comfort him, so that he will not be overwhelmed by excessive sorrow.",
        "Romans 12:19 - Do not take revenge, my dear friends, but leave room for God’s wrath, for it is written: “It is mine to avenge; I will repay,” says the Lord.",
        "Proverbs 19:11 - A person’s wisdom yields patience; it is to one’s glory to overlook an offense.",
        "Micah 7:18-19 - Who is a God like you, who pardons sin and forgives the transgression of the remnant of his inheritance? You do not stay angry forever but delight to show mercy. You will again have compassion on us; you will tread our sins underfoot and hurl all our iniquities into the depths of the sea."
    ],
    "Leadership": [
        "Proverbs 11:14 - For lack of guidance a nation falls, but victory is won through many advisers.",
        "1 Peter 5:2-3 - Be shepherds of God’s flock that is under your care, watching over them—not because you must, but because you are willing, as God wants you to be; not pursuing dishonest gain, but eager to serve; not lording it over those entrusted to you, but being examples to the flock.",
        "Matthew 20:26-28 - Not so with you. Instead, whoever wants to become great among you must be your servant, and whoever wants to be first among you must be your slave— just as the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
        "Joshua 1:9 - Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        "Romans 12:8 - if it is to lead, do it diligently; if it is to show mercy, do it cheerfully.",
        "Proverbs 29:2 - When the righteous thrive, the people rejoice; when the wicked rule, the people groan.",
        "Luke 22:26 - But you are not to be like that. Instead, the greatest among you should be like the youngest, and the one who rules like the one who serves.",
        "Nehemiah 4:14 - After I looked things over, I stood up and said to the nobles, the officials and the rest of the people, “Don’t be afraid of them. Remember the Lord, who is great and awesome, and fight for your families, your sons and your daughters, your wives and your homes.”",
        "Exodus 18:21 - But select capable men from all the people—men who fear God, trustworthy men who hate dishonest gain—and appoint them as officials over thousands, hundreds, fifties and tens.",
        "Proverbs 16:12 - Kings detest wrongdoing, for a throne is established through righteousness.",
        "Deuteronomy 17:18-20 - When he takes the throne of his kingdom, he is to write for himself on a scroll a copy of this law, taken from that of the Levitical priests. It is to be with him, and he is to read it all the days of his life so that he may learn to revere the Lord his God and follow carefully all the words of this law and these decrees and not consider himself better than his fellow Israelites and turn from the law to the right or to the left. Then he and his descendants will reign a long time in his kingdom in Israel.",
        "Psalm 78:72 - And David shepherded them with integrity of heart; with skillful hands he led them.",
        "Isaiah 32:1 - See, a king will reign in righteousness and rulers will rule with justice.",
        "Jeremiah 23:4 - I will place shepherds over them who will tend them, and they will no longer be afraid or terrified, nor will any be missing,” declares the Lord.",
        "Titus 1:7-9 - Since an overseer manages God’s household, he must be blameless—not overbearing, not quick-tempered, not given to drunkenness, not violent, not pursuing dishonest gain. Rather, he must be hospitable, one who loves what is good, who is self-controlled, upright, holy and disciplined. He must hold firmly to the trustworthy message as it has been taught, so that he can encourage others by sound doctrine and refute those who oppose it."
    ],
    "Hope": [
        "Jeremiah 29:11 - For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.",
        "Romans 15:13 - May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
        "Psalm 62:5-6 - Yes, my soul, find rest in God; my hope comes from him. Truly he is my rock and my salvation; he is my fortress, I will not be shaken.",
        "Hebrews 11:1 - Now faith is confidence in what we hope for and assurance about what we do not see.",
        "Lamentations 3:21-24 - Yet this I call to mind and therefore I have hope: Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness. I say to myself, “The Lord is my portion; therefore I will wait for him.”",
        "Romans 8:24-25 - For in this hope we were saved. But hope that is seen is no hope at all. Who hopes for what they already have? But if we hope for what we do not yet have, we wait for it patiently.",
        "Psalm 39:7 - But now, Lord, what do I look for? My hope is in you.",
        "Isaiah 49:23 - Then you will know that I am the Lord; those who hope in me will not be disappointed.",
        "Titus 2:13 - while we wait for the blessed hope—the appearing of the glory of our great God and Savior, Jesus Christ,",
        "1 Peter 1:3 - Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope through the resurrection of Jesus Christ from the dead,",
        "Psalm 42:11 - Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.",
        "Romans 5:3-5 - Not only so, but we also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope. And hope does not put us to shame, because God’s love has been poured out into our hearts through the Holy Spirit, who has been given to us.",
        "Psalm 71:14 - As for me, I will always have hope; I will praise you more and more.",
        "Hebrews 6:19 - We have this hope as an anchor for the soul, firm and secure. It enters the inner sanctuary behind the curtain,",
        "1 Timothy 4:10 - That is why we labor and strive, because we have put our hope in the living God, who is the Savior of all people, and especially of those who believe."
    ],
    "Love": [
        "1 Corinthians 13:4-7 - Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
        "John 3:16 - For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        "Romans 5:8 - But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
        "1 John 4:7-8 - Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God. Whoever does not love does not know God, because God is love.",
        "Colossians 3:14 - And over all these virtues put on love, which binds them all together in perfect unity.",
        "Romans 13:10 - Love does no harm to a neighbor. Therefore love is the fulfillment of the law.",
        "John 15:12 - My command is this: Love each other as I have loved you.",
        "1 John 4:19 - We love because he first loved us.",
        "Ephesians 5:2 - and walk in the way of love, just as Christ loved us and gave himself up for us as a fragrant offering and sacrifice to God.",
        "Song of Solomon 8:7 - Many waters cannot quench love; rivers cannot sweep it away. If one were to give all the wealth of one’s house for love, it would be utterly scorned.",
        "1 Corinthians 16:14 - Do everything in love.",
        "Galatians 5:13 - You, my brothers and sisters, were called to be free. But do not use your freedom to indulge the flesh; rather, serve one another humbly in love.",
        "Philippians 2:2 - then make my joy complete by being like-minded, having the same love, being one in spirit and of one mind.",
        "1 Peter 4:8 - Above all, love each other deeply, because love covers over a multitude of sins.",
        "Romans 8:38-39 - For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord."
    ],
    "Faith": [
        "Hebrews 11:1 - Now faith is confidence in what we hope for and assurance about what we do not see.",
        "Romans 10:17 - Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.",
        "James 2:17 - In the same way, faith by itself, if it is not accompanied by action, is dead.",
        "2 Corinthians 5:7 - For we live by faith, not by sight.",
        "Matthew 17:20 - He replied, “Because you have so little faith. Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, ‘Move from here to there,’ and it will move. Nothing will be impossible for you.”",
        "Romans 1:17 - For in the gospel the righteousness of God is revealed—a righteousness that is by faith from first to last, just as it is written: “The righteous will live by faith.”",
        "Ephesians 2:8-9 - For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God— not by works, so that no one can boast.",
        "Mark 9:23 - “’If you can’?” said Jesus. “Everything is possible for one who believes.”",
        "Luke 17:5 - The apostles said to the Lord, “Increase our faith!”",
        "Galatians 2:20 - I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.",
        "Romans 4:20-21 - Yet he did not waver through unbelief regarding the promise of God, but was strengthened in his faith and gave glory to God, being fully persuaded that God had power to do what he had promised.",
        "1 Corinthians 13:2 - If I have the gift of prophecy and can fathom all mysteries and all knowledge, and if I have a faith that can move mountains, but do not have love, I am nothing.",
        "2 Corinthians 4:18 - So we fix our eyes not on what is seen, but on what is unseen, since what is seen is temporary, but what is unseen is eternal.",
        "James 1:6 - But when you ask, you must believe and not doubt, because the one who doubts is like a wave of the sea, blown and tossed by the wind.",
        "Hebrews 11:6 - And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him."
    ],
    "Gratitude": [
        "1 Thessalonians 5:18 - give thanks in all circumstances; for this is God’s will for you in Christ Jesus.",
        "Psalm 107:1 - Give thanks to the Lord, for he is good; his love endures forever.",
        "Colossians 3:17 - And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus, giving thanks to God the Father through him.",
        "Philippians 4:6 - Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        "Psalm 100:4 - Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
        "Psalm 9:1 - I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.",
        "Psalm 118:24 - The Lord has done it this very day; let us rejoice today and be glad.",
        "Luke 17:15-16 - One of them, when he saw he was healed, came back, praising God in a loud voice. He threw himself at Jesus’ feet and thanked him—and he was a Samaritan.",
        "2 Corinthians 9:15 - Thanks be to God for his indescribable gift!",
        "Revelation 7:12 - saying: “Amen! Praise and glory and wisdom and thanks and honor and power and strength be to our God forever and ever. Amen!”",
        "Psalm 7:17 - I will give thanks to the Lord because of his righteousness; I will sing the praises of the name of the Lord Most High.",
        "Jonah 2:9 - But I, with shouts of grateful praise, will sacrifice to you. What I have vowed I will make good. I will say, ‘Salvation comes from the Lord.’",
        "Psalm 28:7 - The Lord is my strength and my shield; in him my heart trusts, and I am helped; my heart exults, and with my song I give thanks to him.",
        "Hebrews 12:28 - Therefore, since we are receiving a kingdom that cannot be shaken, let us be thankful, and so worship God acceptably with reverence and awe,",
        "Psalm 106:1 - Praise the Lord. Give thanks to the Lord, for he is good; his love endures forever."
    ],
    "Courage": [
        "Joshua 1:9 - Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        "Deuteronomy 31:6 - Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.",
        "Psalm 27:1 - The Lord is my light and my salvation— whom shall I fear? The Lord is the stronghold of my life— of whom shall I be afraid?",
        "Isaiah 41:10 - So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
        "Philippians 4:13 - I can do all this through him who gives me strength.",
        "Psalm 31:24 - Be strong and take heart, all you who hope in the Lord.",
        "1 Corinthians 16:13 - Be on your guard; stand firm in the faith; be courageous; be strong.",
        "Proverbs 28:1 - The wicked flee though no one pursues, but the righteous are as bold as a lion.",
        "2 Timothy 1:7 - For God did not give us a spirit of timidity, but a spirit of power, of love and of self-discipline.",
        "Psalm 118:6 - The Lord is with me; I will not be afraid. What can mere mortals do to me?",
        "Psalm 56:3-4 - When I am afraid, I will put my trust in you. In God, whose word I praise— in God I trust and am not afraid. What can mere mortals do to me?",
        "Isaiah 35:4 - Tell those with fearful hearts, “Be strong, do not fear; your God will come, he will come with vengeance; with divine retribution he will come to save you.”",
        "Haggai 2:4 - But now be strong, Zerubbabel,’ declares the Lord. ‘Be strong, Joshua son of Jozadak, the high priest. Be strong, all you people of the land,’ declares the Lord, ‘and work. For I am with you,’ declares the Lord Almighty.",
        "Ephesians 6:10 - Finally, be strong in the Lord and in his mighty power.",
        "Psalm 138:3 - When I called, you answered me; you greatly emboldened me."
    ],
    "Wisdom": [
        "Proverbs 3:5-6 - Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        "James 1:5 - If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
        "Proverbs 4:6-7 - Do not forsake wisdom, and she will protect you; love her, and she will watch over you. The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.",
        "Ecclesiastes 7:12 - Wisdom is a shelter as money is a shelter, but the advantage of knowledge is this: Wisdom preserves the life of its possessor.",
        "Proverbs 9:10 - The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.",
        "Proverbs 2:6 - For the Lord gives wisdom; from his mouth come knowledge and understanding.",
        "Colossians 2:2-3 - My goal is that they may be encouraged in heart and united in love, so that they may have the full riches of complete understanding, in order that they may know the mystery of God, namely, Christ, in whom are hidden all the treasures of wisdom and knowledge.",
        "Psalm 111:10 - The fear of the Lord is the beginning of wisdom; all who follow his precepts have good understanding. To him belongs eternal praise.",
        "Proverbs 16:16 - How much better to get wisdom than gold, to get insight rather than silver!",
        "Daniel 2:20-21 - “Praise be to the name of God forever and ever; wisdom and power are his. He changes times and seasons; he removes kings and sets up kings. He gives wisdom to the wise and knowledge to the discerning.",
        "Proverbs 1:7 - The fear of the Lord is the beginning of knowledge, but fools despise wisdom and instruction.",
        "Proverbs 13:10 - Pride only breeds quarrels, but wisdom is found in those who take advice.",
        "James 3:17 - But the wisdom that comes from heaven is first of all pure; then peace-loving, considerate, submissive, full of mercy and good fruit, impartial and sincere.",
        "Proverbs 19:20 - Listen to advice and accept discipline, and at the end you will be counted among the wise.",
        "1 Kings 3:9 - So give your servant a discerning heart to govern your people and to distinguish between right and wrong. For who is able to govern this great people of yours?”"
    ],
    "Joy": [
        "Psalm 16:11 - You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.",
        "Philippians 4:4 - Rejoice in the Lord always. I will say it again: Rejoice!",
        "Nehemiah 8:10 - Nehemiah said, “Go and enjoy your rich food and sweet drinks, and send some to those who have nothing prepared. This day is holy to our Lord. Do not grieve, for the joy of the Lord is your strength.”",
        "Romans 15:13 - May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
        "John 15:11 - I have told you this so that my joy may be in you and that your joy may be complete.",
        "Psalm 30:5 - For his anger lasts only a moment, but his favor lasts a lifetime; weeping may stay for the night, but rejoicing comes in the morning.",
        "James 1:2-3 - Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.",
        "Romans 14:17 - For the kingdom of God is not a matter of eating and drinking, but of righteousness, peace and joy in the Holy Spirit,",
        "Psalm 126:5 - Those who sow with tears will reap with songs of joy.",
        "Isaiah 12:3 - With joy you will draw water from the wells of salvation.",
        "Psalm 51:12 - Restore to me the joy of your salvation and grant me a willing spirit, to sustain me.",
        "Habakkuk 3:17-18 - Though the fig tree does not bud and there are no grapes on the vines, though the olive crop fails and the fields produce no food, though there are no sheep in the pen and no cattle in the stalls, yet I will rejoice in the Lord, I will be joyful in God my Savior.",
        "1 Peter 1:8-9 - Though you have not seen him, you love him; and even though you do not see him now, you believe in him and are filled with an inexpressible and glorious joy, for you are receiving the end result of your faith, the salvation of your souls.",
        "Psalm 95:1 - Come, let us sing for joy to the Lord; let us shout aloud to the Rock of our salvation.",
        "Acts 13:52 - And the disciples were filled with joy and with the Holy Spirit."
    ],
    "Kindness": [
        "Ephesians 4:32 - Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
        "Proverbs 11:17 - A kind person benefits themselves, but a cruel person brings trouble on themselves.",
        "Colossians 3:12 - Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
        "Galatians 5:22-23 - But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
        "Luke 6:35 - But love your enemies, do good to them, and lend to them without expecting to get anything back. Then your reward will be great, and you will be children of the Most High, because he is kind to the ungrateful and wicked.",
        "Romans 2:4 - Or do you show contempt for the riches of his kindness, forbearance and patience, not realizing that God’s kindness is intended to lead you to repentance?",
        "Titus 3:4-5 - But when the kindness and love of God our Savior appeared, he saved us, not because of righteous things we had done, but because of his mercy. He saved us through the washing of rebirth and renewal by the Holy Spirit,",
        "Psalm 145:17 - The Lord is righteous in all his ways and faithful in all he does.",
        "Proverbs 31:26 - She speaks with wisdom, and faithful instruction is on her tongue.",
        "Zechariah 7:9 - “This is what the Lord Almighty says: ‘Administer true justice; show mercy and compassion to one another.",
        "Psalm 36:7 - How priceless is your unfailing love, O God! People take refuge in the shadow of your wings.",
        "Proverbs 21:21 - Whoever pursues righteousness and love finds life, prosperity and honor.",
        "Romans 11:22 - Consider therefore the kindness and sternness of God: sternness to those who fell, but kindness to you, provided that you continue in his kindness. Otherwise, you also will be cut off.",
        "2 Peter 1:7 - and to godliness, brotherly kindness; and to brotherly kindness, love.",
        "Psalm 119:68 - You are good, and what you do is good; teach me your decrees."
    ],
    "Humility": [
        "Philippians 2:3-4 - Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.",
        "Proverbs 22:4 - Humility is the fear of the Lord; its wages are riches and honor and life.",
        "James 4:10 - Humble yourselves before the Lord, and he will lift you up.",
        "1 Peter 5:5-6 - In the same way, you who are younger, submit yourselves to your elders. All of you, clothe yourselves with humility toward one another, because, “God opposes the proud but shows favor to the humble.” Humble yourselves, therefore, under God’s mighty hand, that he may lift you up in due time.",
        "Micah 6:8 - He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
        "Proverbs 15:33 - Wisdom’s instruction is to fear the Lord, and humility comes before honor.",
        "Colossians 3:12 - Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
        "Matthew 18:4 - Therefore, whoever takes the lowly position of this child is the greatest in the kingdom of heaven.",
        "Luke 14:11 - For all those who exalt themselves will be humbled, and those who humble themselves will be exalted.",
        "Proverbs 29:23 - Pride brings a person low, but the lowly in spirit gain honor.",
        "Romans 12:3 - For by the grace given me I say to every one of you: Do not think of yourself more highly than you ought, but rather think of yourself with sober judgment, in accordance with the faith God has distributed to each of you.",
        "Ephesians 4:2 - Be completely humble and gentle; be patient, bearing with one another in love.",
        "Proverbs 16:18 - Pride goes before destruction, a haughty spirit before a fall.",
        "James 3:13 - Who is wise and understanding among you? Let them show it by their good life, by deeds done in the humility that comes from wisdom.",
        "Matthew 23:12 - For those who exalt themselves will be humbled, and those who humble themselves will be exalted."
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
