import { DiscordInteractionHelper, getGuild } from "../utils";

import GuildCache from "../models/GuildCache";

export const name = "hello" as const;

export const description = "Say hello to the bot" as const;

export const execute = async (helper: DiscordInteractionHelper) => {
  const target = await GuildCache.get().getHelloTarget();
  if (target) {
    const member = await getGuild().members.fetch(target);
    const dm = await member.createDM();
    await dm.send(hello(helper.user.id, target));
  }
  await helper.finish({
    content: `Hello <@${helper.user.id}> !`,
    ephemeral: false,
  });
};

function hello(from: string, to: string) {
  const randomIndex = Math.floor(Math.random() * database.length);
  const item = database[randomIndex];
  return item.replaceAll(`FROM`, `<@${from}>`).replaceAll(`TO`, `<@${to}>`);
}

const database: string[] = [
  "Hey there, FROM! Ready to conquer the day, or at least snooze the alarm a few more times?",
  "Greetings, TO! Remember, the early bird might catch the worm, but the second mouse gets the cheese!",
  "Well, well, well, if it isn't FROM! Let's make today so awesome that yesterday gets jealous.",
  "Hey TO, it's a new day, which means another chance to pretend we have our lives together!",
  "Good day, good vibe, and good luck, FROM! May your coffee be strong and your Wi-Fi signal stronger.",
  "Ahoy there, TO! Let's navigate through today's challenges like a pro... or at least like we know what we're doing.",
  "Hey FROM, are you ready to tackle the to-do list, or should we just make a 'procrastination playlist' instead?",
  "Greetings, TO! If life gives you lemons, squeeze them into a water gun and have a citrusy battle of positivity!",
  "Rise and shine, FROM! Time to adult like a pro... or just adult like the rest of us, with a hint of chaos!",
  "Hello, TO! They say laughter is the best medicine, so let's overdose on chuckles and giggles today.",
  "Hey FROM, let's make today so amazing that yesterday's selfie gets jealous of today's memories!",
  "G'day, TO! Let's embrace today with open arms and pretend we're not secretly searching for Friday already.",
  "Ahoy-hoy, FROM! Remember, you're not late; you're just experiencing a fashionable entrance!",
  "Top of the morning to you, TO! Let's seize the day before it realizes we're still in our pajamas.",
  "Hey there, FROM! Life's too short to take seriously, so let's sprinkle some silliness into this day.",
  "Salutations, TO! If we can't find the sunshine, let's be the sunshine — or at least the flashlight app on someone's phone!",
  "G'day, FROM! Let's tackle today like we're on a mission to find the TV remote: with determination and a hint of desperation!",
  "Greetings and salutations, TO! Remember, the key to success is pretending you know what you're doing until you actually do.",
  "Hey, hey, hey, FROM! Let's start the day with a smile so wide that people wonder what we've been up to.",
  "Hello, TO! May your day be as wonderful as a puppy's enthusiasm and as smooth as a cat's indifference.",
  "Hey TO, let's make today so awesome that yesterday asks for your autograph.",
  "Greetings, FROM! Let's tackle today like a bear trying to break into a picnic basket - with unwavering determination!",
  "Ahoy-hoy, TO! Let's start the day with a smile that's so big, it could power a small city.",
  "Hello, FROM! If life gives you melons, you might be dyslexic, but that's okay. Embrace the fruity confusion!",
  "Sup, TO! Today's goal: be as amazing as the emoji you send after a perfect punchline.",
  "Hey FROM, let's channel our inner superheroes today, even if our capes are actually just towels.",
  "G'day, TO! Remember, even if you're not Beyoncé, you can still wake up and slay.",
  "Hey there, FROM! Let's dive into the day like a dolphin into the sea - with flips, spins, and unbridled enthusiasm.",
  "Salutations, TO! You know you're adulting when you get excited about a new sponge for the kitchen. Go conquer those mundane victories!",
  "Greetings, FROM! Let's embrace today like a koala clinging to its eucalyptus tree - with a firm grip on positivity!",
  "Hey TO, let's make today so memorable that it becomes a Wikipedia page in the history of your life.",
  "Top o' the mornin', FROM! Let's tackle the day like a leprechaun hunting for gold - but with more productivity and fewer rainbows.",
  "Greetings, TO! Let's bring so much enthusiasm to the day that even the coffee gets jealous.",
  "Hey FROM, let's approach today with the grace and elegance of a penguin on an ice slide... just with less sliding.",
  "Ahoy there, TO! Let's face the day like we're on a secret mission to find the world's best cup of coffee.",
  "Greetings, FROM! Remember, life's too short to hold grudges. Unless those grudges are against alarm clocks.",
  "Hey TO, let's make today as amazing as the cat videos that kept us up half the night.",
  "Rise and shine, FROM! It's a new day, which means a fresh start to accidentally delete all our browser history again.",
  "Greetings, TO! Today's goal: impress everyone with your multitasking skills - like juggling life, coffee, and ambition.",
  "Hello, FROM! If life gives you lemons, make lemonade, find someone who also got lemons, and have a lemon party!",
  "Ahoy-hoy, TO! Let's tackle the day with the energy of a squirrel that just discovered a hidden stash of acorns.",
  "Hey FROM, let's make today so incredible that even your mirror reflection does a double take.",
  "G'day, TO! Let's take on today like it's a buffet - sample everything and regret nothing!",
  "Greetings, FROM! Remember, if Plan A fails, there are still 25 letters left. Let's explore the alphabet of success!",
  "Hey TO, let's approach today like a detective searching for motivation clues. The magnifying glass is optional.",
  "Salut TO, comment va FROM aujourd'hui ?",
  "Bonjour TO ! J'espère que ta journée sera aussi lumineuse que FROM !",
  "Coucou TO, n'oublie pas de transmettre mes salutations chaleureuses à FROM.",
  "Hello TO, j'espère que tu passes une excellente journée en compagnie de FROM.",
  "Salutations TO ! As-tu prévu une aventure passionnante avec FROM aujourd'hui ?",
  "Hey TO, as-tu des nouvelles passionnantes à raconter à FROM ?",
  "Salut TO, j'espère que FROMn café est aussi fort que l'amitié entre FROM et FROMi !",
  "Bonjour TO, que la journée de FROM soit remplie de succès et de sourires.",
  "Coucou TO, envoie mes meilleures pensées à FROM et rappelle-lui que chaque jour est une nouvelle opportunité.",
  "Hello TO, rien de tel qu'un petit coucou pour mettre un sourire sur le visage de FROM !",
  "Salutations TO, j'espère que tu brilles aujourd'hui, FROMut comme FROM dans ma vie.",
  "Hey TO, prends soin de FROM comme tu prends soin de notre amitié !",
  "Salut TO, envoie un high-five virtuel à FROM de ma part !",
  "Bonjour TO, j'espère que ta journée sera aussi incroyable que FROM.",
  "Coucou TO, fais briller la journée de FROM avec ta présence éclatante !",
  "Hello TO, chaque fois que tu parles à FROM, c'est comme un rayon de soleil dans sa journée !",
  "Salutations TO, que la journée de FROM soit aussi fantastique que FROMn amitié.",
  "Hey TO, rappelez-vous : chaque journée est meilleure avec FROM à vos côtés !",
  "Salut TO, FROMn amitié est un cadeau précieux pour FROM chaque jour.",
  "Bonjour TO, que la journée de FROM soit aussi merveilleuse que nos conversations !",
];
