// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
const viem = require("viem");
const fs = require("fs");
const csv = require("csv-parser");
const TrendingAlgorithm = require("../getTrends");
// const { TrendingAlgorithm } = require("../getTrends");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const postTexts = [
  "Enjoying a beautiful day at the park!",
  "Traffic was terrible this morning.",
  "Just finished an amazing workout! 💪",
  "Excited about the upcoming weekend getaway!",
  "Trying out a new recipe for dinner tonight.",
  "Feeling grateful for the little things in life.",
  "Rainy days call for cozy blankets and hot cocoa.",
  "The new movie release is a must-watch!",
  "Political discussions heating up on the timeline.",
  "Missing summer vibes and beach days.",
  "Just published a new blog post. Check it out!",
  "Feeling a bit under the weather today.",
  "Exploring the city's hidden gems.",
  "New year, new fitness goals! 💪",
  "Technology is changing the way we live.",
  "Reflecting on the past and looking ahead.",
  "Just adopted a cute furry friend! 🐾",
  "Late-night gaming session with friends.",
  "Attending a virtual conference on AI.",
  "Winter blues got me feeling low.",
  "Sipping coffee and enjoying a good book.",
  "Exploring the world of virtual reality.",
  "Productive day ticking off my to-do list.",
  "Just finished a challenging workout routine.",
  "Celebrating a milestone at work! 🎉",
  "Sunday brunch with friends.",
  "Learning a new language for personal growth.",
  "Quiet evening with a good book.",
  "Reflecting on the importance of mental health.",
  "New painting in progress! 🎨",
  "Weekend road trip to explore scenic views.",
  "Enjoying a cup of tea and watching the sunset.",
  "Coding a new project with enthusiasm.",
  "Feeling inspired after attending a workshop.",
  "Winter sports day at the local park.",
  "Quality time with family this weekend.",
  "Attending a live music concert tonight.",
  "Practicing mindfulness with meditation.",
  "Trying out a new dessert recipe.",
  "Excited about the upcoming gaming tournament.",
  "Planning a garden makeover for spring.",
  "Celebrating a friend's birthday tonight! 🎂",
  "Feeling accomplished after a productive day.",
  "A cozy evening with a good movie.",
  "Exploring local art galleries this weekend.",
  "New book release from my favorite author!",
  "Attending a virtual reality meetup.",
  "Reflecting on the beauty of nature.",
  "Cooking a special dinner for loved ones.",
  "Feeling optimistic about the week ahead.",
  "Starting a new fitness challenge tomorrow! 💪",
  "Sunday bike ride through scenic trails.",
  "Can't believe the injustice happening in our society.",
  "Feeling a sense of fear after watching a thriller movie.",
  "Heartbroken after hearing the news about a natural disaster.",
  "The state of the world's environment is just disgusting.",
  "Pure happiness: celebrating a loved one's achievement!",
  "Laughter is the best medicine—enjoying a comedy show.",
  "Sharing love and positive vibes with everyone! ❤️",
  "An amusing incident brightened up my day!",
  "Enjoying a quiet evening with a book and some tea.",
  "Admiring the beauty of nature during a peaceful hike.",
  "Sending affectionate vibes to all my followers!",
  "Experiencing awe at the breathtaking sunset.",
  "Disappointed with the service at a local restaurant.",
  "A surprise gift from a friend made my day!",
  "Finding acceptance in the midst of life's challenges.",
  "Overflowing with adoration for my adorable pet! 🐾",
  "Anticipating a thrilling adventure in the coming weeks.",
  "A bitter experience turned into a valuable lesson.",
  "Finding calmness in the midst of a busy day.",
  "Confusion clouds my mind as I navigate through decisions.",
  "Excitement building up for the upcoming vacation!",
  "Kindness witnessed today restored my faith in humanity.",
  "Pride in achieving a personal milestone.",
  "A moment of shame for not standing up against injustice.",
  "Fuming with anger after a heated argument.",
  "The fear of the unknown is keeping me up at night.",
  "Heartfelt sadness after bidding farewell to a dear friend.",
  "The state of corruption in our society is utterly disgusting.",
  "Overflowing happiness: welcoming a new family member!",
  "Laughter is the key to joy—attending a stand-up comedy show.",
  "Sending love to all my followers on this beautiful day! ❤️",
  "Amused by the antics of my pet—it's pure amusement!",
  "Enjoying every moment of this trip—pure enjoyment!",
  "Admiring the dedication of volunteers at a local charity.",
  "Sending affectionate vibes to friends and family.",
  "Awe-struck by the beauty of the night sky.",
  "Disappointed with the lack of progress in a personal project.",
  "A surprise visit from an old friend brought tears of joy.",
  "Embracing acceptance of life's ups and downs.",
  "Overflowing adoration for a cute rescue puppy! 🐶",
  "Anticipating the release of a much-awaited movie.",
  "Bitter experience at the customer service department.",
  "Finding calmness amidst the chaos of daily life.",
  "Confusion reigns as I try to make sense of recent events.",
  "Excitement building up for a surprise birthday party.",
  "Witnessed an act of kindness that made my day.",
  "Pride in completing a challenging fitness challenge.",
  "A moment of shame for not speaking up against injustice.",
  "Reflecting on the beauty of diversity in our world.",
  "Excitement for a quiet evening with a good book.",
  "Feeling bitter about the unfairness in the workplace.",
  "Calmness prevails as I practice mindfulness.",
  "Confusion surrounds me as I navigate through life's choices.",
  "Excitement for a weekend road trip to explore new places.",
  "Kindness witnessed today restores my faith in humanity.",
  "Pride in accomplishing personal and professional goals.",
  "Shame for not being true to my values in a difficult situation.",
  "Revisiting old memories, feeling a sense of elation.",
  "The victory of our team brought euphoria to the city.",
  "Embracing the beauty of nature, a moment of contentment.",
  "Meditating by the serene lake, finding inner peace.",
  "Overflowing with gratitude for life's blessings.",
  "Hopeful for a brighter tomorrow, despite challenges.",
  "Empowered to make a difference in my community.",
  "Compassion in action: supporting a local charity event.",
  "A moment of tenderness, connecting with loved ones.",
  "Arousal of excitement as I await a special announcement.",
  "Enthusiastically diving into a new project.",
  "Feeling a sense of fulfillment after reaching a milestone.",
  "Reverence for the beauty of a historic landmark.",
  "Elation after a surprise reunion with old friends.",
  "The euphoria of a live music concert under the stars.",
  "Contentment in the simplicity of a quiet Sunday.",
  "Serenity found in the pages of a favorite book.",
  "Gratitude for the support received during tough times.",
  "Hopeful about the possibilities of a new journey.",
  "Empowerment through learning and personal growth.",
  "Compassion towards those in need during the holidays.",
  "Tenderness in the warmth of a cozy winter evening.",
  "Arousal of excitement for an upcoming adventure.",
  "Enthusiasm for a creative project in the making.",
  "Fulfillment in completing a challenging workout routine.",
  "Reverence for the artistry displayed in a museum.",
  "Elation after achieving a personal goal.",
  "Elation over discovering a hidden gem in the city.",
  "The euphoria of a surprise birthday celebration.",
  "Contentment in the simplicity of a home-cooked meal.",
  "Serenity found in the melody of a peaceful piano.",
  "Gratitude for the supportive community around me.",
  "Hopeful about the prospects of a new business venture.",
  "Empowerment through mentoring and guiding others.",
  "Compassion shown through acts of kindness in the community.",
  "Tenderness in a heartfelt message to a loved one.",
  "Arousal of excitement before a much-awaited trip.",
  "Enthusiasm for a new artistic project in the works.",
  "Feeling a sense of fulfillment after helping others.",
  "Reverence for the historical significance of a landmark.",
  "Elation after achieving a fitness milestone.",
  "The euphoria of a successful product launch.",
  "Contentment in the embrace of a loved one.",
  "Serenity found in the beauty of a sunset by the sea.",
  "Gratitude for the small joys that each day brings.",
  "Hopeful about the potential for personal growth.",
  "Empowerment through learning a new skill.",
  "Compassion in volunteering for a local charity.",
  "Tenderness in a quiet moment shared with a pet.",
  "Arousal of excitement for an upcoming festival.",
  "Enthusiasm for a DIY home improvement project.",
  "Fulfillment in completing a challenging puzzle.",
  "Reverence for the wonders of nature on a hiking trail.",
  "Elation after a surprise reunion with a childhood friend.",
  "Suffering from despair after another setback.",
  "Overwhelmed by grief, missing a loved one dearly.",
  "Loneliness creeps in as the night grows colder.",
  "Jealousy consumes me as I witness others' success.",
  "Resentment building up over past betrayals.",
  "Frustration mounts as obstacles block my path.",
  "Boredom sets in, the day feels endlessly dull.",
  "Anxiety grips my heart, worry clouds my thoughts.",
  "Intimidation by the unknown future ahead.",
  "Helplessness sinks in as challenges pile up.",
  "Envy eats away at me as I see others' prosperity.",
  "Regret over missed opportunities haunts my thoughts.",
  "Disgust at the sight of injustice and cruelty.",
  "Drowning in despair, hope slipping through my fingers.",
  "Grief weighs heavy, tears a constant companion.",
  "Loneliness in a crowded room, a silent cry for connection.",
  "Jealousy gnaws at my confidence, a toxic emotion.",
  "Resentment festers, poisoning relationships.",
  "Frustration boils over, a volcanic eruption of emotions.",
  "Boredom settles like dust, life feels mundane.",
  "Anxiety grips my chest, a relentless grip on my thoughts.",
  "Intimidation by the challenges ahead, fear takes hold.",
  "Helplessness engulfs me, drowning in a sea of problems.",
  "Envy poisons my thoughts, coveting others' success.",
  "Regret for decisions that led to a painful present.",
  "Disgust at the corruption that stains society.",
  "Sinking in despair, each day darker than the last.",
  "Grief overwhelms, a storm of emotions within.",
  "Loneliness echoes in empty spaces, yearning for connection.",
  "Jealousy poisons my thoughts, resentment brewing within.",
  "Resentment festers, a wound that refuses to heal.",
  "Frustration escalates, a thunderstorm of emotions.",
  "Boredom lingers, a stagnant pool of indifference.",
  "Embarking on a journey of discovery, fueled by curiosity and a thirst for knowledge.",
  "Lost in the vast sea of information, an indifferent wave in the digital ocean.",
  "The complex puzzle of life leaves me in a state of perpetual confusion, seeking answers in the chaos.",
  "A numbness settles over me, a shield against the overwhelming emotions life throws my way.",
  "Gazing at the sunset, a melancholic longing for moments that slip through the fingers of time.",
  "Revisiting old photographs, caught in the embrace of nostalgia's bittersweet symphony.",
  "Torn between conflicting emotions, an ambivalence that paints my decisions in shades of uncertainty.",
  "Embracing the ebb and flow of life, finding acceptance in the dance of existence.",
  "Facing challenges head-on, a determination that fuels the fire within to achieve the impossible.",
  "Serenity found in the stillness of nature, a tranquil retreat from the chaos of the modern world.",
  "Curiosity leading me down the rabbit hole of knowledge, a perpetual student in life's classroom.",
  "Floating through the day with an air of indifference, detached from the mundane happenings around.",
  "Entangled in the web of thoughts, confusion reigning as I navigate the labyrinth of ideas.",
  "Numb to the chaos, emotions locked away, a stoic facade concealing the inner turmoil.",
  "Melancholy whispers in the breeze, a silent conversation with the echoes of forgotten dreams.",
  "Stumbling upon an old journal, nostalgia flooding in waves, carrying me to moments long gone.",
  "A tapestry of conflicting feelings, weaving through uncertainty, caught in the threads of ambivalence.",
  "Embracing the flaws, finding acceptance in imperfection, a journey towards self-love.",
  "Determination burning like a wildfire, overcoming obstacles, turning dreams into reality.",
  "Tranquil moments by the ocean, serenity washing over, a peaceful retreat within the waves' embrace.",
  "Exploring new horizons with the spark of curiosity, an adventurer in the vast landscape of knowledge.",
  "Drifting through the day with a nonchalant demeanor, embracing the art of indifference.",
  "Wrestling with thoughts, a perplexed mind lost in the labyrinth of life's complexities.",
  "Immersed in a state of emotional numbness, a shield against the storm of daily struggles.",
  "A melancholic symphony playing in the background, the soundtrack of a wistful heart.",
  "Flipping through the pages of an old yearbook, nostalgia painting smiles and tears on my face.",
  "Torn between opposing emotions, an ambivalence that colors my decisions with shades of uncertainty.",
  "Embracing life's imperfections, finding acceptance in the journey, scars and all.",
  "A fiery determination burning within, fueled by the vision of reaching unparalleled heights.",
  "Basking in the serenity of a quiet forest, where the whispers of nature bring peace to the soul.",
  "Indifferent to the noise of the world, a silent observer in the midst of life's cacophony.",
  "Navigating through the labyrinth of thoughts, confusion a constant companion in the maze of ideas.",
  "An impenetrable numbness shields me from the emotional storms, a fortress of stoic resilience.",
  "Melancholy painting the world in hues of nostalgia, a canvas of bittersweet memories.",
  "A journey into the past, flipping through the pages of an old diary, nostalgia taking the lead.",
  "Ambivalence clouding decisions, caught in the crossroads of conflicting emotions.",
  "Embracing imperfections, finding acceptance in the mosaic of life's beautiful chaos.",
  "Determination as the driving force, propelling me forward on the path to extraordinary achievements.",
  "Seeking serenity in the melody of raindrops, a tranquil escape from the noise of everyday life.",
  "Curiosity driving the exploration of the unknown, a seeker of knowledge in uncharted territories.",
  "Drifting through the day with an air of nonchalance, indifferent to the trivialities of life.",
  "Lost in the labyrinth of thoughts, confusion casting shadows on the quest for clarity.",
  "Wrapped in the cloak of emotional numbness, a shield against the storms of life's turbulence.",
  "Melancholy as a companion, painting the canvas of life with the brushstrokes of wistful yearning.",
  "Leafing through the pages of an old photo album, nostalgia weaving tales of laughter and tears.",
  "Ambivalence in the air, caught between the crossroads of conflicting emotions and decisions.",
  "Embracing the beauty in imperfections, finding acceptance in the mosaic of life's unpredictable art.",
  "Determination ablaze, forging a path through challenges, sculpting dreams into tangible realities.",
  "Immerse in the serenity of a moonlit night, where the quiet whispers of nature bring peace to the soul.",
  "Fueled by curiosity, venturing into uncharted realms, a fearless explorer of the mysteries of the world.",
  "Wrapped in the cloak of emotional numbness, a shield against the storms of life's turbulence.",
  "Dancing through life with the exuberance of a carefree spirit, embracing joy and zest at every turn.",
  "Basking in the golden glow of contentment, a serene river flowing through the landscape of the heart.",
  "Gazing towards the horizon with hopeful eyes, painting a canvas of dreams illuminated by the sun of optimism.",
  "Standing tall, proud as an oak, the branches of achievement reaching towards the sky of accomplishment.",
  "A heart overflowing with gratitude, a garden where appreciation blooms in the soil of kindness and connection.",
  "Extending a hand, empathetic threads weaving a tapestry of understanding, embracing the joys and sorrows of others.",
  "Compassionate clouds, heavy with care, showering empathy on the parched grounds of human suffering.",
  "Playfully dancing in the rain of laughter, a whimsical spirit twirling in the puddles of joy and lightheartedness.",
  "Soaring on the wings of a free spirit, unburdened by the chains of conformity, painting the sky with independence.",
  "Bathed in the glow of inspiration, a creative phoenix rising from the ashes of ordinary thoughts to explore new realms.",
  "Navigating the sea of hope, sailing towards the sunrise of possibilities, confident in the ship of positive anticipation.",
  "Striding with confidence, footprints of self-assuredness imprinted on the sands of challenges conquered and victories claimed.",
  "Lost in the symphony of the night, a moonlit serenade that whispers tales of wanderlust and moonlit dreams.",
  "Unveiling the layers of curiosity, a labyrinth of questions leading to the treasure troves of undiscovered knowledge.",
  "In the embrace of the autumn breeze, leaves of ambivalence dancing in a waltz between choices and uncertainties.",
  "Gratitude as a guiding star, navigating the constellation of blessings in the vast universe of life's precious moments.",
  "With a zestful heart, sprinting through fields of enthusiasm, chasing sunbeams and laughter in the meadows of joy.",
  "A compassionate rain, tears of empathy falling gently, nurturing the seeds of kindness in the garden of human connections.",
  "Proudly scaling the peaks of achievement, a mountaineer conquering challenges and planting the flag of success.",
  "Embraced by the hopeful dawn, a gardener sowing seeds of optimism, tending to the blooms of a brighter tomorrow.",
  "A playful escapade in the carnival of life, carousel laughter and cotton candy dreams swirling in the joyous atmosphere.",
  "Floating on clouds of inspiration, an artist painting the sky with strokes of creativity, creating a masterpiece of dreams.",
  "Navigating the river of contentment, a serene boat cruise through the tranquil waters of inner peace and acceptance.",
  "With empathy as a lantern, wandering through the dark alleys of sorrow, illuminating the path with compassion and care.",
  "A free spirit soaring on the wings of dreams, leaving trails of independence in the azure sky of boundless possibilities.",
  "Bathed in the golden hues of gratefulness, a sunset of appreciation casting its warm glow on the landscapes of the heart.",
  "Confident strides in the dance of life, a ballroom where self-assuredness leads, twirling through challenges with grace.",
  "Hopeful whispers of wind, carrying the promises of a brighter tomorrow, a symphony of optimism in the air of possibilities.",
  "Playfully juggling responsibilities, a circus performer balancing the acts of work and joy, tossing laughter into the air.",
  "Whispering tales of inspiration to the stars, a storyteller crafting constellations from the threads of imagination.",
  "Charting a course through the waves of hopeful anticipation, a sailor steering towards the shores of dreams yet unexplored.",
  "A compassionate rain, tears of empathy falling gently, nurturing the seeds of kindness in the garden of human connections.",
  "Proudly scaling the peaks of achievement, a mountaineer conquering challenges and planting the flag of success.",
  "Embraced by the hopeful dawn, a gardener sowing seeds of optimism, tending to the blooms of a brighter tomorrow.",
  "A playful escapade in the carnival of life, carousel laughter and cotton candy dreams swirling in the joyous atmosphere.",
  "Floating on clouds of inspiration, an artist painting the sky with strokes of creativity, creating a masterpiece of dreams.",
  "Navigating the river of contentment, a serene boat cruise through the tranquil waters of inner peace and acceptance.",
  "With empathy as a lantern, wandering through the dark alleys of sorrow, illuminating the path with compassion and care.",
  "A free spirit soaring on the wings of dreams, leaving trails of independence in the azure sky of boundless possibilities.",
  "Bathed in the golden hues of gratefulness, a sunset of appreciation casting its warm glow on the landscapes of the heart.",
  "Confident strides in the dance of life, a ballroom where self-assuredness leads, twirling through challenges with grace.",
  "Hopeful whispers of wind, carrying the promises of a brighter tomorrow, a symphony of optimism in the air of possibilities.",
  "Playfully juggling responsibilities, a circus performer balancing the acts of work and joy, tossing laughter into the air.",
  "Whispering tales of inspiration to the stars, a storyteller crafting constellations from the threads of imagination.",
  "Charting a course through the waves of hopeful anticipation, a sailor steering towards the shores of dreams yet unexplored.",
  "A compassionate rain, tears of empathy falling gently, nurturing the seeds of kindness in the garden of human connections.",
  "Proudly scaling the peaks of achievement, a mountaineer conquering challenges and planting the flag of success.",
  "Embraced by the hopeful dawn, a gardener sowing seeds of optimism, tending to the blooms of a brighter tomorrow.",
  "A playful escapade in the carnival of life, carousel laughter and cotton candy dreams swirling in the joyous atmosphere.",
  "Drowning in the abyss of despair, a heart shattered into fragments, lost in the echoing silence of hopelessness.",
  "Bitterness festering like a venomous vine, entwining the soul in a web of resentment, poisoning the garden of peace.",
  "Wandering through the desert of loneliness, each step a heavy sigh, mirages of connection shimmering but never materializing.",
  "Yearning for a touch that's not there, echoes of a distant warmth haunting the heart in the cold embrace of solitude.",
  "Eyes wide open in the night, fearful shadows dancing on the walls, the mind a prisoner of imagined horrors.",
  "Apprehensive steps on the tightrope of uncertainty, a balancing act where the fall seems inevitable, anxiety a constant companion.",
  "Overwhelmed by the weight of the world, Atlas with trembling shoulders, each responsibility a boulder in the landscape of exhaustion.",
  "Jealousy, a green-eyed monster, lurking in the shadows, casting a dark cloud over the sunshine of others' success.",
  "Devastated by the storm of betrayal, the wreckage of trust scattered like debris, a heart torn by the winds of broken promises.",
  "Frustrated fingers tapping on the keyboard, a symphony of annoyance composing an unsolvable puzzle of unmet expectations.",
  "Envious eyes fixated on the gilded prize, a heartache fueled by the painful desire for possessions that seem forever out of reach.",
  "Dismissive glances, a fortress built with indifference, walls impenetrable to the pleas of understanding and recognition.",
  "Shattered dreams lie on the floor like fragments of glass, a mosaic of disappointment crafted by the hands of frustration.",
  "Loneliness, a silent companion in the night, the only echo in the chamber of solitude, a heart's solitary nocturne.",
  "Fearful whispers in the dark, the mind haunted by the specter of the unknown, shadows dancing to the rhythm of anxiety's tune.",
  "Bitterness, a bitter aftertaste lingering on the tongue, each word a reminder of wounds that refuse to heal with the passing of time.",
  "Overwhelmed by the cacophony of expectations, a drowning soul in the tempest of pressure, struggling to stay afloat.",
  "Jealousy, a venom that seeps through the veins, poisoning the heart and turning it into a breeding ground for discontent.",
  "Devastated by the revelation of betrayal, the trust shattered like fragile glass, leaving shards of pain in its wake.",
  "Frustrated attempts to mend a broken connection, the threads of understanding slipping through the fingers like grains of sand.",
  "Envious gazes cast upon the podium of success, a bitter pill swallowed, the taste lingering as a constant reminder of unattained heights.",
  "Dismissive gestures, a curtain drawn to shield the vulnerability, a stage where emotions take a backseat to the performance of indifference.",
  "Despair like a heavy fog, enveloping every thought, blurring the path ahead, a journey in the labyrinth of utter hopelessness.",
  "Bitterness, a bitter chill in the air, freezing moments into icicles of resentment that dangle precariously over the landscape of memory.",
  "Loneliness, a solitary moon in a starless sky, casting a cold glow on the landscape of isolation, where echoes bounce in empty spaces.",
  "Yearning for the warmth of a vanished sun, a heartache painted in the hues of a sunset that never graced the horizon.",
  "Fearful eyes scanning the shadows, a prisoner of the night, terrorized by the lurking monsters born from the mind's darkest corners.",
  "Apprehensive whispers in the wind, a forecast of uncertainty, the mind's weather vane spinning wildly in the storm of doubt.",
  "Overwhelmed by the maze of expectations, a minotaur of pressure lurking in the labyrinth, waiting to devour the spirit of resilience.",
  "Jealousy, a festering wound, the pain intensifying with each glance at the garden of others' achievements, blooming beyond the fence.",
  "Devastated, a heart in ruins, the echoes of shattered dreams reverberating in the chambers, a requiem for what once was whole.",
  "Frustrated attempts to untangle the knot of confusion, the threads of understanding slipping further into the labyrinth of miscommunication.",
  "Envious eyes locked on the treasure chest of opportunities, a heartache fueled by the desire for keys that seem forever elusive.",
  "Dismissive gestures, a curtain drawn to shield the vulnerability, a stage where emotions take a backseat to the performance of indifference.",
  "Shattered dreams lie on the floor like fragments of glass, a mosaic of disappointment crafted by the hands of frustration.",
  "Loneliness, a silent companion in the night, the only echo in the chamber of solitude, a heart's solitary nocturne.",
  "Awe-struck by the breathtaking sunrise over the mountains.",
  "Navigating through the challenges with determination.",
  "Nostalgia hits while flipping through an old photo album.",
  "Thrilled to witness the grandeur of a cultural festival.",
  "Calmness found in the rhythm of raindrops on the windowpane.",
  "Overwhelmed by the support received during a personal challenge.",
  "Excitement builds as the countdown to a long-awaited vacation begins.",
  "Reflecting on life's journey, grateful for the lessons learned.",
  "Bittersweet emotions arise while bidding farewell to a dear friend.",
  "Curiosity sparked by exploring a mysterious ancient ruin.",
  "Admiration for the intricate details of a handcrafted masterpiece.",
  "Overjoyed by the warmth of a cozy fireplace on a winter evening.",
  "Inspiration strikes while observing the colors of a vibrant sunset.",
  "Motivated to achieve fitness goals after an invigorating workout.",
  "Gratitude for the simple joys found in a cup of morning coffee.",
  "Feeling empowered after conquering a challenging hiking trail.",
  "Amused by the antics of playful kittens during playtime.",
  "Contemplating life's mysteries under the starry night sky.",
  "Joyful reunion with long-lost friends after years of separation.",
  "Excitement builds while preparing for a surprise celebration.",
  "Satisfaction derived from successfully completing a DIY project.",
  "Feeling blessed for the supportive community in times of need.",
  "Captivated by the serenity of a tranquil garden in full bloom.",
  "Anticipation for an upcoming adventure in an exotic destination.",
  "Reflecting on personal growth achieved through life experiences.",
  "Nostalgic memories flood in while revisiting childhood favorites.",
  "Appreciation for the vibrant culture experienced during travel.",
  "Confidence soars after overcoming public speaking anxiety.",
  "Contentment in the midst of a family gathering filled with laughter.",
  "Enthusiasm for learning new skills and expanding knowledge.",
  "Surprise and delight at discovering a hidden gem in the city.",
  "A sense of accomplishment after completing a challenging workout.",
  "Wonderment at the beauty of a double rainbow after the rain.",
  "Optimism for a bright future amidst challenging times.",
  "Pride in achieving a personal milestone in career progression.",
  "Happiness blooms like flowers in a garden on a sunny day.",
  "Elation over discovering a rare book in a quaint bookstore.",
  "Curiosity piqued by the mysteries of an ancient archaeological site.",
  "Mesmerized by the cosmic dance of fireflies on a moonlit night.",
  "Intrigued by the symphony of colors in an abstract art exhibition.",
  "Giggles and joy echo in the air during a children's playdate.",
  "Enveloped in serenity while practicing mindfulness by the lake.",
  "Chasing dreams like a kite soaring high in the vast open sky.",
  "Spellbound by the elegance of a ballroom dance under crystal chandeliers.",
  "Whimsical delight in a world of fairy tales and magical creatures.",
  "Pensive contemplation amid the ancient ruins of a forgotten civilization.",
  "Embracing the thrill of speed on a rollercoaster's exhilarating twists.",
  "Harmony resonates as musicians play a melody of unity and togetherness.",
  "A burst of creativity in the quiet solitude of an artist's studio.",
  "Radiant joy akin to blooming flowers on a sun-kissed spring morning.",
  "A sense of wonder at the vastness of the cosmos on a stargazing night.",
  "Rejuvenated by the salty breeze and the sound of waves at the seaside.",
  "Whispers of inspiration from the rustling leaves in a serene forest.",
  "Savoring the warmth of a cup of cocoa on a chilly winter evening.",
  "Heartfelt gratitude for the laughter shared during a family reunion.",
  "Embarking on a culinary adventure, savoring exotic flavors around the world.",
  "Euphoria floods in as the final puzzle piece clicks into place.",
  "Awe-inspired by the grandeur of an ancient cathedral's intricate architecture.",
  "Captivated by the ethereal beauty of a field filled with fireflies.",
  "Immersed in the enchanting melodies of a street musician's violin.",
  "Joyful laughter resonates through a lively summer carnival.",
  "Exploring the universe within during a mindful meditation session.",
  "Soaring like a free spirit on the winds of a coastal cliff.",
  "Dazzled by the elegance of a masquerade ball's dazzling costumes.",
  "Whimsical delight in a world of whimsical fairy tales.",
  "Reflective contemplation amid the ruins of a forgotten era.",
  "Riding the adrenaline rush on a rollercoaster's wild twists.",
  "Harmony resonates as musicians play a symphony of unity.",
  "A burst of artistic creativity in the quietude of an artist's studio.",
  "Radiant joy akin to blossoming flowers on a sunlit spring morning.",
  "Awe-inspired by the vastness of the cosmos on a stargazing night.",
  "Rejuvenated by the salty breeze and the sound of waves at the seaside.",
  "Whispers of inspiration from the rustling leaves in a serene forest.",
  "Savoring the warmth of a cup of cocoa on a chilly winter evening.",
  "Heartfelt gratitude for the laughter shared during a family reunion.",
  "Embarking on a culinary odyssey, savoring flavors around the world.",
  "Euphoria floods in as the final puzzle piece fits perfectly.",
  "Awe-struck by the grandeur of an ancient cathedral's intricate architecture.",
  "Curiosity awakened by the mysteries of an ancient archaeological site.",
  "Giddy with excitement as the first snowflakes dance from the sky.",
  "Contentment envelops as the aroma of freshly baked bread fills the air.",
  "Inspired by the resilience of a lone tree standing tall in a storm.",
  "Lost in the pages of a captivating novel, transported to another world.",
  "Drenched in nostalgia while flipping through an old family photo album.",
  "Spark of inspiration ignites like a shooting star in the night sky.",
  "Imbued with gratitude for the simple pleasure of a warm cup of tea.",
  "Marveling at the kaleidoscope of colors in a vibrant street market.",
  "Awash with serenity as the sun sets over a tranquil lakeside retreat.",
  "Drowning in sorrow as memories of lost love resurface.",
  "Numbness sets in as the weight of loneliness grows heavier.",
  "Tears fall like raindrops, mourning the end of a cherished friendship.",
  "Despair clouds the mind, feeling adrift in an endless sea of darkness.",
  "Shattered by betrayal, trust crumbles like fragile glass.",
  "Aching heart, the symphony of pain plays in the silence of solitude.",
  "Emotional storm, a whirlwind of sadness engulfs every thought.",
  "Haunted by regrets, the ghost of the past lingers relentlessly.",
  "Torn apart by grief, the echoes of loss reverberate through the soul.",
  "Isolation deepens, an emotional winter where warmth is but a distant memory.",
  "Soul-crushing disappointment, hopes shattered like fragile glass.",
  "Painful echoes of a love once cherished, now lost in the abyss of time.",
  "Heartache deepens, a solitary journey through the abyss of despair.",
  "Melancholy lingers, a bittersweet serenade in the quietude of solitude.",
  "Bitterness like a poison, seeping into every crevice of the wounded heart.",
  "Emotional exhaustion, the weight of the world crushing weary shoulders.",
  "Sorrowful echoes, a symphony of pain played by the strings of loss.",
  "Darkness descends, engulfing the soul in the shadows of despair.",
  "Desperation whispers, the silent plea for a glimmer of hope in the abyss.",
  "Heart in ruins, the remnants of shattered dreams scattered in the wind.",
  "Shattered by the echoes of a shattered dream, fragments of hope scattered.",
  "Avoiding the thorns of regret, walking barefoot on the path of remorse.",
  "In the labyrinth of grief, the walls echo with the footsteps of lost joy.",
  "A soul adrift in the sea of solitude, waves of loneliness crashing relentlessly.",
  "The bitterness of betrayal, a taste that lingers, staining the palate of trust.",
  "In the ruins of hope, echoes of shattered dreams whisper tales of loss.",
  "Sinking like a stone in the ocean of heartbreak, each ripple a sigh of despair.",
  "Tears, the ink staining the pages of a journal, a testament to silent grief.",
  "In the wasteland of lost trust, the echoes of broken promises reverberate.",
  "Avoiding the shards of shattered dreams, walking the tightrope of resilience.",
  "Suffocating in the silence of solitude, where echoes of laughter once thrived.",
  "Haunted by the specter of lost possibilities, a ghost that refuses to fade away.",
  "In the labyrinth of despair, the echoes of a broken heart reverberate endlessly.",
  "Sinking like autumn leaves in the river of sorrow, carried away by the current.",
  "In the garden of broken dreams, petals fall, a silent testimony to shattered hopes.",
  "Tears, the currency of grief, spent in the marketplace of lost love and longing.",
  "Wandering in the maze of betrayal, the walls closing in with every wrong turn.",
  "A soul weathered by the storm of heartbreak, seeking refuge in the calm after.",
  "In the tapestry of despair, threads of hope unravel, leaving a portrait of sorrow.",
  "Like a withered rose in the garden of love, petals fall, a silent surrender to time.",
  "In the void of heartache, echoes of a love song play, each note a pang of longing.",
  "Nostalgia, a bittersweet dance in the moonlit ballroom of cherished memories.",
  "In the symphony of grief, each tear is a note, composing a melancholic melody.",
  "Betrayal, a venomous serpent slithering through the garden of trust, poisoning roots.",
  "Sinking in the quicksand of despair, the harder you fight, the deeper you descend.",
  "Wandering through the cemetery of lost dreams, tombstones marking untold sorrows.",
  "Swept away by the river of regret, the currents of the past refusing to release.",
  "Whispers of lost love linger in the attic of the heart, forgotten but not erased.",
  "In the gallery of broken promises, each shattered vow framed, a painful exhibition.",
  "The echoes of solitude, a silent conversation between a soul and its shadows.",
  "Dancing on sunshine, each step a celebration of the joy found in simple moments.",
  "Laughter echoes in the air, a chorus of happiness that lifts the spirit higher.",
  "In the garden of contentment, each bloom whispers tales of inner peace and joy.",
  "Chasing dreams under the vibrant sky, a journey fueled by hope and enthusiasm.",
  "Serenading the stars with a heart full of gratitude, a melody of thankfulness.",
  "Basking in the glow of accomplishment, each milestone a stepping stone to happiness.",
  "In the dance of positivity, every step is a rhythm, uplifting the soul in harmony.",
  "Overflowing with joy, a cup of laughter shared with friends, a moment cherished.",
  "Draped in the warmth of kindness, a quilt of compassion stitched with love.",
  "In the garden of friendships, each bloom a testament to the beauty of camaraderie.",
  "In the embrace of love, each heartbeat is a melody, dancing to the rhythm of affection.",
  "Surrounded by the colors of joy, a canvas painted with laughter and endless smiles.",
  "In the symphony of excitement, each note is a burst of energy, igniting the soul with fervor.",
  "A surprise gift, wrapped in anticipation, unfolds a moment of delight and wonder.",
  "Lost in the maze of curiosity, each twist and turn unveils the treasures of discovery.",
  "Floating on clouds of gratitude, each raindrop a blessing, a shower of thankfulness.",
  "Like a comet of inspiration, streaking through the sky of creativity, leaving trails of brilliance.",
  "In the celebration of success, fireworks of accomplishment light up the night sky of triumph.",
  "A symphony of laughter, each note a key to unlocking the door of boundless happiness.",
  "In the carnival of emotions, the rollercoaster of thrill sends the heart on a wild ride.",
  "Standing before the grandeur of the Eiffel Tower, a moment to reflect on the beauty of Parisian dreams.",
  "Lost in the enchantment of Disneyland, each ride a journey into the realm of childhood fantasies.",
  "Exploring the wonders of Ferrari World, the roar of engines creating a symphony of speed.",
  "Amidst the tulip fields of Keukenhof, a tapestry of colors that paints the soul with springtime joy.",
  "Wandering through the historical streets of Kyoto, each step a journey into the heart of Japan's traditions.",
  "In the embrace of the Grand Canyon, nature's masterpiece, a moment to marvel at Earth's grandeur.",
  "Journeying through the serenity of Santorini, where each sunset paints the sky with hues of tranquility.",
  "Amazed by the architectural marvels of Petra, each stone telling tales of an ancient civilization.",
  "Embarking on a gondola ride in Venice, each canal reflecting the romance of this timeless city.",
  "At the summit of Machu Picchu, a breathtaking panorama that whispers the secrets of ancient civilizations.",
  "In the heart of New York City, Times Square dazzles with lights, a vibrant spectacle of urban energy.",
  "Captivated by the historical charm of the Colosseum, each stone echoing tales of gladiator valor.",
  "Sailing the azure waters of the Maldives, each wave a whisper of serenity in paradise.",
  "In the midst of the Amazon rainforest, a symphony of wildlife creates an orchestra of nature's wonders.",
  "Walking the Great Wall of China, each step a testament to ancient engineering marvels.",
  "At the summit of Mount Fuji, a breathtaking sunrise that paints the sky with hues of accomplishment.",
  "Exploring the ancient ruins of Angkor Wat, each stone whispering stories of Khmer civilization.",
  "Skiing down the slopes of the Swiss Alps, each turn a dance with the majesty of snow-capped peaks.",
  "In the tranquility of Kyoto's bamboo forest, whispers of ancient Zen wisdom echo through the groves.",
  "Cruising the fjords of Norway, each icy landscape a breathtaking masterpiece of nature's grandeur.",
  "At the front row of Adele's concert, each note of 'Someone Like You' resonates with soul-stirring emotion.",
  "Dancing under the stars at Beyoncé's live show, feeling the power of 'Single Ladies' in every move.",
  "In the crowd of a Taylor Swift concert, the lyrics of 'Love Story' create an enchanting fairy tale.",
  "Rocking out to the guitar solos at a Queen tribute concert, a journey back in time with Freddie's spirit.",
  "Swaying to Ed Sheeran's acoustic melodies, a serene evening filled with 'Perfect' moments.",
  "Immersed in the pulsating beats of a Bruno Mars concert, where 'Uptown Funk' becomes a city of joy.",
  "At a Michael Jackson tribute show, moonwalking through the hits, a celebration of the King of Pop.",
  "Swinging to the rhythms of a Frank Sinatra tribute, feeling the timeless charm of 'Fly Me to the Moon'.",
  "In the mosh pit of a Metallica concert, the thunderous chords create a symphony of headbanging ecstasy.",
  "Experiencing the magic of a Coldplay concert, where 'Fix You' becomes a beacon of hope in the night.",
  "At a Justin Bieber concert, the infectious beats of 'Baby' create a dance floor of unbridled enthusiasm.",
  "In the spotlight at a Lady Gaga show, each costume change is a metamorphosis of creativity and artistry.",
  "Immersed in the soulful melodies of Adele, tears flow freely, moved by the emotion of 'Hello'.",
  "Drenched in confetti at a Katy Perry concert, a kaleidoscope of colors igniting the night sky.",
  "In the audience of a Jay-Z performance, the lyrics of 'Empire State of Mind' become an anthem of pride.",
  "Dancing to Shakira's rhythmic beats, hips swaying to the hypnotic charm of 'Hips Don't Lie'.",
  "At a U2 concert, the anthemic chords of 'With or Without You' create a timeless moment of connection.",
  "Rocking out at a Guns N' Roses show, the iconic riffs of 'Sweet Child o' Mine' echoing in the night.",
  "In the crowd of an Ariana Grande concert, the high notes of 'Into You' create a euphoric symphony.",
  "Swaying to the reggae vibes of Bob Marley's tribute concert, each chord a journey to Jamaica's soul.",
  "Captivated by the spellbinding plot twists, the audience applauds, experiencing a rollercoaster of emotions at the movie premiere.",
  "As the credits roll, a profound sense of nostalgia washes over, reminiscent of cherished moments in classic films.",
  "Streaming the latest web series, the viewer is engrossed in the characters' journey, feeling a sense of connection and empathy.",
  "At the film festival, the indie filmmaker's creation receives a standing ovation, evoking pride and a sense of accomplishment.",
  "Watching a heartwarming family drama, tears flow freely as the characters overcome challenges, leaving the viewer with a warm glow.",
  "At the Oscars, the actor graciously accepts an award, radiating joy and gratitude for the recognition of their outstanding performance.",
  "Discovering a hidden gem in the world of documentaries, the viewer is enlightened and inspired, feeling a renewed sense of curiosity.",
  "As the movie credits roll, the viewer experiences a mix of awe and contemplation, pondering the deeper meanings woven into the storyline.",
  "Binge-watching a thrilling crime series, the suspense keeps the viewer on the edge of their seat, creating a rush of adrenaline.",
  "As the closing scene unfolds, a sense of satisfaction washes over, completing the cinematic journey with a profound and fulfilling ending.",
  "Celebrating a historic victory in the World Cup, the nation erupts in joy, united by the triumph of their football team.",
  "At the Olympics, the athlete's perseverance shines through, earning a gold medal and inspiring a generation with their remarkable achievement.",
  "In the cricket championship, a nail-biting finish leaves fans on the edge of their seats, experiencing a rollercoaster of emotions.",
  "Witnessing a record-breaking marathon, spectators are filled with awe and admiration for the endurance and dedication of the runners.",
  "In the tennis grand slam, a fierce rivalry unfolds, captivating fans with a display of skill and sportsmanship on the world stage.",
  "Cheering for the underdog in the basketball finals, the crowd erupts in applause as the team defies odds to claim the championship title.",
  "At the golf tournament, the golfer's precision and focus lead to a stunning victory, leaving spectators in awe of their exceptional skill.",
  "Experiencing the thrill of a high-speed Formula 1 race, fans are on the edge of their seats as drivers compete for the championship.",
  "In the cycling world championship, the climber conquers challenging terrains, symbolizing determination and achievement against all odds.",
  "Witnessing a heartwarming comeback in the hockey finals, fans share tears of joy as the team secures a historic victory after adversity.",
  "After a series of defeats, the soccer team faces disappointment, struggling to find the silver lining in a challenging season.",
  "In the tennis tournament, a highly anticipated player experiences a setback, leaving fans in shock and questioning the unforeseen turn of events.",
  "Facing a defeat in the championship, the boxer reflects on the challenges, vowing to return stronger and more determined in the next bout.",
  "In the midst of a cycling race, a tire blowout leads to frustration for the cyclist, who valiantly tries to overcome the unexpected obstacle.",
  "The gymnast's unexpected fall during a routine sparks a wave of sympathy from the audience, highlighting the vulnerability of sports.",
  "In the golf tournament, a missed crucial putt results in defeat, causing the golfer to reflect on the pressure of high-stakes competition.",
  "Experiencing a series of losses in the basketball season, the team grapples with frustration, determined to turn the tide with renewed effort.",
  "Despite meticulous training, the swimmer faces disappointment as a split-second miscalculation costs them the lead in a crucial race.",
  "The weightlifter's failed attempt at a personal record results in frustration, highlighting the challenging nature of pushing physical limits.",
  "In the midst of a soccer match, an unexpected own goal creates a moment of despair for the player, as teammates console and encourage them.",
  "In the serene beauty of a sunset, nature unfolds a canvas of colors, evoking a sense of tranquility and wonder.",
  "Embarking on a spontaneous road trip, the traveler discovers hidden gems, creating memories that will be cherished for a lifetime.",
  "Amidst the bustling city, a quiet café becomes a sanctuary for reflection, where a cup of coffee brings solace to the wandering mind.",
  "Exploring the vibrant street art of a cultural neighborhood, each mural tells a story, infusing the city with creativity and expression.",
  "In the world of science, a breakthrough discovery unfolds, pushing the boundaries of knowledge and opening new frontiers of exploration.",
  "Connecting with the melody of a live orchestra, the music enthusiast experiences a symphony that resonates deep within the soul.",
  "Embracing the aroma of freshly baked bread, the home chef finds joy in the art of baking, creating delicious memories for loved ones.",
  "Wandering through a historical museum, the history enthusiast becomes immersed in the tales of the past, envisioning bygone eras.",
  "In the realm of literature, a captivating novel transports the reader to distant lands, weaving a tapestry of imagination and escape.",
  "Capturing the essence of a bustling market, the photographer freezes moments in time, each frame telling a unique and vibrant story.",
  "Underneath the city lights, the dancer expresses emotions through graceful movements, creating a mesmerizing performance under the night sky.",
  "In the heart of a bustling market, the street food connoisseur indulges in a culinary adventure, savoring diverse flavors and aromas.",
  "As the first snowflake descends, the winter enthusiast eagerly prepares for a season of frosty delights, anticipating the magic of snow-covered landscapes.",
  "Amidst the pages of a captivating mystery novel, the reader unravels clues and secrets, experiencing a thrilling journey of suspense and revelation.",
  "Surrounded by the vibrant colors of a flower garden, the gardener nurtures blossoms, finding joy in the beauty of nature's ever-changing canvas.",
  "At the astronomy observatory, the stargazer marvels at the vastness of the cosmos, contemplating the mysteries hidden within the celestial expanse.",
  "Engulfed in the aroma of freshly brewed coffee, the writer finds inspiration in every sip, embarking on a journey of creativity and prose.",
  "In the realm of fashion, the designer unveils a collection that tells a story, blending innovation and tradition on the runway of creativity.",
  "As the waves crash against the shore, the surfer embraces the thrill of riding the ocean's energy, capturing the essence of freedom in each wave.",
  "Exploring the historical architecture of an ancient city, the traveler is transported to a bygone era, where each monument whispers tales of the past.",
  "Successfully avoided eye contact with my crush in the hallway. Mission accomplished. #TeenCrush #StealthMode",
  "Ran out of snacks during a movie marathon. Crisis level: Emergency! #MovieNightStruggles #TeenProblems",
  "Spent an hour choosing the perfect filter for a selfie. The struggle for that Instagram aesthetic is real. #SelfieQueen #TeenVibes",
  "Lost my headphones again. How do they vanish into thin air? #HeadphoneMystery #TeenLife",
  "Decided to study for exams but ended up making memes about studying instead. Procrastination level: Expert. #ProcrastinationNation #TeenConfessions",
  "Got dressed for the day, then remembered it's Saturday. Oops. #WeekendVibes #TeenStruggles",
  "Survived a group project without any drama. Miracles do happen. #GroupProjectSuccess #TeenAchievements",
  "Entered the kitchen with the intention to cook. Left with a bag of chips. Cooking is overrated, anyway. #MasterChefInTraining #TeenHumor",
  "Staring at the clock in class, waiting for the bell to ring like it's the most exciting event of the day. #ClassCountdown #TeenLife",
  "Discovered a new book series and spent the whole night reading. Who needs sleep, anyway? #BookwormLife #LateNightReading",
  "Bought a new video game, played for hours, forgot to eat. The ultimate gaming session. #GamerLife #NoFoodGaming",
  "Spent the day binge-watching a new series. Productivity level: Zero. #LazyDay #TVSeriesMarathon",
  "Caught up on the latest fashion trends and now planning a shopping spree. #Fashionista #TrendyTeen",
  "Decided to learn a new instrument. Day one: Still trying to figure out how to hold it. #MusicNovice #LearningJourney",
  "Spent hours creating the perfect playlist for every mood. Music is my therapy. #PlaylistMaker #TeenMusicLover",
  "Successfully cooked a gourmet meal for the family. Chef skills unlocked! #ChefMode #TeenChef",
  "Spontaneously booked a weekend getaway. Adventure awaits! #TravelBug #WeekendEscape",
  "Attended a concert and danced the night away. Music is the heartbeat of life. #ConcertVibes #DanceAllNight",
  "Rediscovered childhood cartoons and had a nostalgia-filled marathon. #CartoonNostalgia #TeenMemories",
  "Embarked on a DIY home decor project. Let's hope it turns out better than last time. #DIYAdventure #TeenHomeDecor",
  "Spent the afternoon at a museum, pretending to be cultured. Art enthusiast in the making. #MuseumDay #TeenArtLover",
  "Started a blog about random thoughts and musings. Blogging is the new diary. #BloggerLife #TeenBlogger",
  "Relishing a peaceful afternoon with a classic novel. Quiet moments are the best moments. #BookLover #PeacefulAfternoon",
  "Reflecting on a lifetime of memories, each wrinkle tells a story. Embracing the beauty of aging. #LifeReflections #BeautyInAging",
  "Exploring the world of digital art. It's never too late to discover new passions. #DigitalArtistry #LateBloomer",
  "Savoring the flavors of a home-cooked meal. Simple joys are the heart of happiness. #HomeCooking #SimpleJoys",
  "Embarking on a journey of learning a new language. The mind stays young with every new word. #LanguageLearning #NeverTooLate",
  "Attended a classical music concert, feeling the timeless melodies resonate. Music transcends generations. #ClassicalMusic #TimelessMelodies",
  "Capturing the beauty of nature through photography. Every snapshot is a treasure. #NaturePhotography #SeniorPhotographer",
  "Reconnecting with old friends over a cup of tea. Friendship, the true essence of companionship. #OldFriends #Companionship",
  "Embarked on a road trip to revisit cherished places from the past. Nostalgia, the ultimate travel companion. #RoadTrip #NostalgiaTour",
  "Joined a community choir, harmonizing with fellow voices. Music creates bonds that withstand time. #CommunityChoir #HarmonyInAging",
  "Exploring the art of meditation, finding tranquility in the stillness of the mind. #MeditationJourney #TranquilMind",
  "Taking a stroll in the garden, appreciating the beauty of blooming flowers. Nature's wonders never cease. #GardenWalk #FloralBeauty",
  "Sipping on a favorite vintage wine, each sip telling a story of the years gone by. Cheers to a life well-lived. #WineLover #VintageCheers",
  "Participated in a community art class, unleashing creativity in the golden years. Art has no age limit. #ArtClass #SeniorArtistry",
  "Embarking on a journey of writing a memoir, documenting a lifetime of experiences. Every story matters. #MemoirWriting #SeniorStories",
  "Attended a lecture on history, always fascinated by the lessons from the past. Learning is a lifelong adventure. #HistoryLecture #SeniorLearning",
  "Rediscovered the joy of cooking traditional family recipes. The kitchen, a place of cherished memories. #FamilyRecipes #SeniorCooking",
  "Joined a nature photography club, capturing the beauty of the great outdoors. Every click is a connection to nature. #NaturePhotography #SeniorPhotographer",
  "Attended a jazz concert and swayed to the rhythm of timeless tunes. Music, a constant companion in the golden years. #JazzConcert #SeniorMusic",
  "Joined a writing group, penning down thoughts and reflections. Writing, a journey into the depths of the soul. #WritingGroup #SeniorWriter",
  "Embarked on a solo travel adventure, discovering the beauty of new places at my own pace. #SoloTravel #SeniorExplorer",
  "Attended a vintage car show, reminiscing about the classics that once ruled the roads. Nostalgia in every rev. #VintageCars #ClassicRides",
  "Started a community garden, growing not just plants but friendships too. Green thumbs unite! #CommunityGarden #SeniorGardener",
  "Hosted a family dinner, where laughter echoed louder than the clinking of utensils. Family, the heart of happiness. #FamilyDinner #SeniorHost",
  "Enrolled in a dance class for seniors, moving to the rhythm of life. Age is just a number on the dance floor. #DanceClass #SeniorDancer",
  "Visited an art gallery, appreciating the brushstrokes that tell tales of creativity. Art, an eternal companion. #ArtGallery #SeniorArtLover",
  "Started a book club for seniors, where discussions are as lively as the characters in the novels. #BookClub #SeniorReaders",
  "Hosted a picnic in the park, basking in the warmth of friendship and sunshine. Simple joys, timeless memories. #ParkPicnic #SeniorJoy",
  "Participated in a local theater production, proving that the stage belongs to every age. #TheaterProduction #SeniorActor",
  "Embarked on a hiking adventure, conquering trails and relishing the beauty of nature. Age is just a number on the mountaintop. #HikingAdventure #SeniorHiker",
  "Hosted a photography exhibition featuring snapshots of a life well-lived. Every photo has a story to tell. #PhotographyExhibition #SeniorPhotographer",
  "Joined a seniors' cycling club, feeling the wind in my hair and the freedom of the open road. #CyclingClub #SeniorCyclist",
  "Attended a wine tasting event, savoring the richness of flavors that age like fine wine. Cheers to the golden years! #WineTasting #SeniorWineLover",
  "Started learning ballroom dancing, gliding gracefully across the dance floor. Ageless elegance in every step. #BallroomDancing #SeniorDancer",
  "Organized a community painting event, turning blank canvases into a masterpiece of shared creativity. #PaintingEvent #SeniorArtist",
  "Hosted a 'memory lane' evening with old friends, reminiscing about the adventures that shaped our lives. #MemoryLane #SeniorReminiscing",
  "Joined a seniors' astronomy club, stargazing and finding wonder in the vastness of the cosmos. #AstronomyClub #SeniorStargazer",
  "Attended a local jazz festival, tapping toes to the tunes that have stood the test of time. Music, a lifelong love affair. #JazzFestival #SeniorMusicLover",
  "Started a blog sharing the wisdom gained through the years, proving that every day is a chance to learn and grow. #SeniorWisdom #Blog",
  "Participated in a charity run, proving that age is no barrier to supporting meaningful causes. #CharityRun #SeniorRunner",
  "Survived a challenging physics exam. Equations, you won't defeat me!",
  "Exploring the world of coding. Debugging is an adventure on its own! #CodingJourney #HighSchoolCoder",
  "Joined the school debate team. Words are my weapons, and I'm ready for battle!",
  "Started a photography club at school. Capturing moments, one snapshot at a time!",
  "Daydreaming about the upcoming prom. The dress, the dance – it's a fairytale in the making!",
  "Convinced the teacher to have class outdoors. Learning equations with a side of fresh air!",
  "Accidentally spilled paint in art class. Abstract art, right? #ArtClassAdventures #HighSchoolArtist",
  "Trying to master the perfect kickflip on my skateboard. Skating into the weekend like a pro!",
  "Bonding with friends over the latest K-pop sensation. Fangirling at its finest!",
  "Spent hours perfecting a chemistry experiment. Mixing potions like a wizard!",
  "Successfully organized a surprise birthday party for a friend. Party planning expert mode: Achieved!",
  "Joined the drama club to unleash my inner actor. Lights, camera, action!",
  "Got my hands on the latest fantasy novel. Diving into realms of magic and adventure!",
  "Mastering the art of the perfect doodle during boring classes. Doodles: A+!",
  "Attempting to break the school record for the longest handstand. Wish me luck!",
  "Sneaking snacks into class like a pro. The art of snack-smuggling is a sacred skill!",
  "Hosting a sleepover with friends this weekend. Preparing for a night of laughter and memories!",
  "Spent hours on a TikTok dance, only to realize I have two left feet. Dance fail: Unleashed!",
  "Accidentally liked my crush's old photo while stalking their profile. Awkward level: Maximum!",
  "Tried to impress my crush with a smooth conversation. Ended up spilling my drink. Smooth level: Nonexistent!",
  "Mastered the art of creating paper airplanes during lecture. Paper planes: Soaring to new heights!",
  "Trying to set a new trend by juggling textbooks between classes. Academic juggling: A unique skill!",
  "Hiding a snack stash in my backpack for emergency cravings. Snack ninja mode: Activated!",
  "Planning a surprise scavenger hunt for friends. Anticipating the thrill and excitement!",
  "Danced in the rain to celebrate the end of exams. Rain dance: Unexpectedly refreshing!",
  "Accidentally sent a text meant for a friend to the class group chat. Texting fail: Oops moment!",
  "Tried a magic trick to impress classmates. Magic fail: Where did that rabbit go?",
  "Perfecting the art of creating origami during a dull lecture. Origami mastery: A+!",
  "Attempting to set a new record for the most consecutive hacky sack kicks. Hacky sack skills: Unleashed!",
  "Creating a secret handshake with friends. Friendship level: Expert!",
  "Embarking on a mission to find the best burger joint in town. Burger connoisseur: Reporting for duty!",
  "Practicing a stand-up comedy routine for the upcoming talent show. Comedy gig: In the making!",
  "Accidentally sent a love letter to the wrong person. Love note fail: Maximum embarrassment!",
  "Attempting to impress the teacher with an elaborate science experiment. Science geek mode: Activated!",
  "Crafting intricate friendship bracelets for the whole squad. Friendship level: Expert weaver!",
  "Attempting to beat the record for the most consecutive cartwheels. Cartwheel challenge: Underway!",
  "Organizing a movie marathon with friends. Popcorn and cinematic adventures await!",
  "Experimenting with a new hair color. A bold change for a bold semester!",
  "Building a time capsule to capture memories for the future. Time-traveling emotions!",
  "Accidentally walked into the wrong classroom on the first day. Classroom mix-up: Awkward start!",
  "Trying out a new smoothie recipe for a healthy start to the week. Smoothie enthusiast: Level up!",
  "Reflecting on the challenges of the school year. Feeling a bit overwhelmed with assignments.",
  "Encountered some mean-spirited comments online. Dealing with online hate is never easy.",
  "Had a bad day at school. Everything seems to be going wrong.",
  "Feeling down after not making the sports team. Disappointment lingers.",
  "Witnessed a heated argument in the cafeteria. Unpleasant atmosphere at lunch.",
  "Received a not-so-great grade on a major project. Academic frustration setting in.",
  "Dealing with a personal setback. Sometimes life throws unexpected challenges.",
  "Feeling lonely on a Saturday night. Sometimes solitude hits harder than expected.",
  "Experiencing cyberbullying. Hateful messages online are disheartening.",
  "Caught in a torrential rainstorm without an umbrella. Today's weather is just bad luck.",
  "Missing an important event due to unforeseen circumstances. A day filled with sadness.",
  "Dealing with unfounded rumors circulating about personal life. Rumors can be hurtful.",
  "Got a flat tire on the way to an important meeting. Talk about a series of bad events!",
  "Feeling a sense of emptiness after a close friend moves away. Farewells are always sad.",
  "Facing rejection from a dream college. Disheartened but determined to explore other paths.",
  "Encountering online toxicity during a gaming session. Hateful comments can ruin the fun.",
  "Having a bad hair day and feeling self-conscious. Bad hair days can affect confidence.",
  "Feeling a sense of despair after a major project failure. Hard work didn't pay off this time.",
  "Experiencing hate comments for expressing personal opinions. Online negativity prevails.",
  "Having a string of bad luck with constant technology malfunctions. Tech troubles galore!",
  "Missing out on a long-anticipated event due to unexpected circumstances. A day filled with sadness.",
  "Trying out a new study technique for upcoming exams. Exploring different learning strategies.",
  "Organizing a community cleanup event for a cleaner neighborhood. Promoting environmental awareness.",
  "Sharing favorite book recommendations with classmates. Building a mini book club.",
  "Experimenting with a new recipe for a school bake sale. Baking adventures in the kitchen.",
  "Collaborating on a school project with peers. Teamwork makes the dream work.",
  "Attending a school club meeting to explore new interests. Dabbling in extracurricular activities.",
  "Exploring a new part-time job opportunity for gaining work experience. Career development in progress.",
  "Attending a school assembly to stay informed about upcoming events and announcements. Staying connected with school activities.",
  "Exploring a new hobby of photography during free time. Capturing moments through a lens.",
  "Participating in a science fair to showcase a unique experiment. Sharing knowledge with peers.",
  "Attending a workshop on time management to enhance organizational skills. Striving for efficiency.",
  "Volunteering at a local charity event to give back to the community. Contributing to social causes.",
  "Collaborating on a group project to promote teamwork and shared responsibilities. Group effort in action.",
  "Participating in a debate club to enhance critical thinking and communication skills. Intellectual engagement in progress.",
  "Celebrating a friend's birthday with a surprise party. Joyful moments and laughter all around!",
  "Successfully completing a challenging coding project. Excitement for overcoming coding hurdles!",
  "Attending a school talent show to support classmates. Applauding the diverse talents on display!",
  "Exploring a new hiking trail with friends over the weekend. Nature, laughter, and good vibes!",
  "Winning a friendly sports competition against rival schools. Victory celebrations in full swing!",
  "Receiving a heartfelt letter from a pen pal in another country. Connecting across the globe!",
  "Creating a beautiful mural with fellow art enthusiasts. The power of collaboration and creativity!",
  "Participating in a school-wide art exhibition. Witnessing creativity and spreading positive vibes!",
  "Achieving a personal best in a track and field competition. The thrill of victory and self-improvement!",
  "Collaborating on a science project that received recognition at a regional fair. Science triumphs and smiles!",
  "Attending a surprise birthday party organized by friends. Surrounded by love, laughter, and good company!",
  "Successfully fundraising for a school charity initiative. The joy of giving back to the community!",
  "Participating in a multicultural festival, celebrating diversity with music, dance, and delicious food!",
  "Organizing a virtual talent show during challenging times, bringing smiles to classmates' faces!",
];

const database = {
  users: [],
  posts: [],
  comments: [],
  trendingWords: [],
};

// Array containing Ethereum addresses
const ethereumAddresses = [
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x1b40709934C8F5BE573Fd30eDa5Fb459c1Bde8f3",
  "0x1e2656453a0C471F25Ce1116096309CcE821bf71",
];

// Function to randomly select an Ethereum address
function getRandomEthereumAddress() {
  const randomIndex = Math.floor(Math.random() * ethereumAddresses.length);
  return ethereumAddresses[randomIndex];
}


const filePath = "./sentimentdataset.csv"
fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (data) => {
    // if (results.post.length < 100) {
    // Read only the first 100 lines
    const post = {
      id: data.Id, // Assuming 'id' is a column in the CSV file
      username: data.User.trim(),
      address: getRandomEthereumAddress(),
      content: {
        message: data.Text.trim(),
        upload: "",
      }, // Assuming 'message' is a column in the CSV file
      comments: [],
      likes: [],
      reposts: [],
      date_posted: data.Timestamp,
    };
    // results.post.push(post);
    // postTexts.push(data.Text.trim());
    database.posts.push(post);
    // }
  })
  .on("end", () => {
    // console.log(results); // Output the constructed data
    // console.log(postTexts);
  });

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const payload = data.payload;
  let JSONpayload = {};
  // try {
  //   if(String(data.metadata.msg_sender).toLowerCase() === DAPP_ADDRESS_REALY.toLowerCase())
  // }

  const payloadStr = viem.hexToString(payload);
  JSONpayload = JSON.parse(JSON.parse(payloadStr));
  console.log(`received request ${JSON.stringify(JSONpayload)}`);
  console.log(database);

  let advance_req;

  if (JSONpayload.method === "createPost") {
    if (JSONpayload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + JSONpayload.data.message),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    console.log("creating post...");
    const post = {
      id: 0,
      username: "",
      address: "",
      content: {
        message: "",
        upload: "",
      },
      comments: [],
      likes: [],
      reposts: [],
      date_posted: 0,
    };
    post.id = database.posts.length;
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    post.username = user.username;
    post.address = user.address;
    post.content = {
      message: JSONpayload.data.message,
      upload: JSONpayload.data.upload,
    };
    post.date_posted = 0;
    database.posts.push(post);
    database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    user?.posts.push(post.id);
    database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "editPost") {
    const post = database.posts.find((item) => item.id == JSONpayload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + JSONpayload.data.message),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    post.content.message = JSONpayload.data.message;
    const result = JSON.stringify(database);

    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "deletePost") {
    const post = database.posts.find((item) => item.id == JSONpayload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const newDB = database.posts.filter(
      (item) => item.id !== JSONpayload.data.id
    );
    database.posts = newDB;
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "likePost") {
    const post = database.posts.find(
      (item) => item.id == Number(JSONpayload.data.id)
    );
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);

      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
      return;
    }
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    post.likes.push(user.id);
    user.likes = user.likes + 1;
    user.liked_posts.push(post.id);
    database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "createProfile") {
    const userExist = database.users.find(
      (item) => item.address == data.metadata.msg_sender
    );
    if (userExist) {
      console.log("User address already mapped to a profile");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
      return;
    }
    if (JSONpayload.data.username == "") {
      console.log("username cannot be empty or null");
      const result = JSON.stringify({
        error: String("Username:" + JSONpayload.data.username),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
      return;
    }
    console.log("creating profile...");
    const user = {
      id: 0,
      username: "",
      bio: "",
      address: "",
      profile_pic: "",
      posts: [],
      comments: [],
      reposts: [],
      likes: 0,
      liked_posts: [],
      date_joined: 0,
    };
    user.id = database.users.length;
    user.username = JSONpayload.data.username;
    user.address = data.metadata.msg_sender;
    user.bio = JSONpayload.data.bio;
    user.profile_pic = JSONpayload.data.profile_pic;
    user.date_joined = 0;
    database.users.push(user);
    database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "editProfile") {
    const user = database.users.find(
      (item) => item.address == data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.username == "" || null) {
      console.log("username cannot be empty");
      const result = JSON.stringify({
        error: String("Username:" + JSONpayload.data.username),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.bio == "" || null) {
      console.log("bio cannot be empty");
      const result = JSON.stringify({
        error: String("Bio:" + JSONpayload.data.bio),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    user.username = JSONpayload.data.username;
    user.bio = JSONpayload.data.bio;
    user.profile_pic = JSONpayload.data.profile_pic;
    const result = JSON.stringify(database);

    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "deleteProfile") {
    const user = database.users.find(
      (item) => item.address == data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const newDB = database.users.filter(
      (item) => item.id !== JSONpayload.data.id
    );
    database.users = newDB;
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "repost") {
    const post = database.posts.find((item) => item.id == JSONpayload.data.id);
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    post.reposts.push(user.id);
    user.reposts.push(post.id);
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "createComment") {
    const comment = {
      id: 0,
      post_id: 0,
      username: "",
      content: {
        message: "",
        upload: "",
      },
      comments: [],
      likes: 0,
      reposts: [],
      date_commented: 0,
    };

    const post = database.posts.find(
      (item) => item.id == JSONpayload.data.post_id
    );
    if (!post) {
      console.log("post id is incorrect");
      const result = JSON.stringify({
        error: String("Post_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const user = database.users.find(
      (item) => item.address === data.metadata.msg_sender
    );
    if (!user) {
      console.log("User address doesn't exist");
      const result = JSON.stringify({
        error: String("UserAddress:" + data.metadata.msg_sender),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    if (JSONpayload.data.message == "" || null) {
      console.log("message cannot be empty");
      const result = JSON.stringify({
        error: String("Message:" + JSONpayload.data.message),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    comment.id = database.comments.length;
    comment.post_id = JSONpayload.data.post_id;
    comment.username = user.username;
    comment.content = {
      message: JSONpayload.data.message,
      upload: JSONpayload.data.upload,
    };
    comment.date_posted = 0;
    database.comments.push(comment);
    database.trendingWords = new TrendingAlgorithm().alltrendingPosts();
    user.comments.push(comment);
    post.comments.push(comment);
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else if (JSONpayload.method === "deleteComment") {
    const comment = database.comments.find(
      (item) => item.id == JSONpayload.data.id
    );
    if (!comment) {
      console.log("comment id is incorrect");
      const result = JSON.stringify({
        error: String("Comment_Id:" + JSONpayload.data.id),
      });
      const hexresult = viem.stringToHex(result);
      await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }
    const newDB = database.comments.filter(
      (item) => item.id !== JSONpayload.data.id
    );
    database.comments = newDB;
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexResult }),
    });
  } else {
    console.log("Incorrect method");
    const result = JSON.stringify({
      error: String("Method does not exist: " + JSONpayload.method),
    });
    const hexresult = viem.stringToHex(result);
    await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        payload: hexresult,
      }),
    });
  }

  const json = await advance_req?.json();
  console.log(
    "Received status " +
    advance_req?.status +
    " with body " +
    JSON.stringify(json)
  );
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const hexResult = viem.stringToHex(database);
  advance_req = await fetch(rollup_server + "/notice", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexResult }),
  });
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

let firstTimeCounter = 0;
(async () => {
  while (true) {
    console.log("Inside a cartesi dapp while loop");
    if (firstTimeCounter < 1) {
      console.log(database);
      for (let i = 0; i < postTexts.length; i++) {
        const post = {
          id: i, // Assuming 'id' is a column in the CSV file
          username: i,
          address: getRandomEthereumAddress(),
          content: {
            message: postTexts[i],
            upload: "",
          }, // Assuming 'message' is a column in the CSV file
          comments: [],
          likes: [],
          reposts: [],
          date_posted: new Date().toLocaleDateString(),
        };
        // results.post.push(post);
        // postTexts.push(data.Text.trim());
        database.posts.push(post);
      }
      // database.posts.push(postTexts);
      console.log(database.posts.length);
      const hexResult = viem.stringToHex(database);
      advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: hexResult }),
      });
      firstTimeCounter++;
      console.log("Sent first preseeded notice \n");
    }

    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again \n");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
