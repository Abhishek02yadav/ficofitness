// FicoFit V2 FINAL — Data Layer — NO EMOJI IN THIS FILE
const DAYS      = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_FOCUS = ['Chest + Tri','Back + Bi','Shoulders + Core','Legs','Chest + Back','Shoulders + Arms','Rest Day'];
const DAY_LABEL = ['CHT','BCK','SHD','LEG','CHB','ARM','REST'];
const DAY_TYPE  = ['push','pull','legs','push','pull','hybrid','rest'];

const WORKOUTS = {
  0: {
    label: 'Chest + Triceps',
    type: 'CHT',
    note: 'Compound: 90s rest | Isolation: 60s rest',
    exercises: [
      { name: 'Barbell Bench Press',        sets: '4 x 8',       type: 'compound'  },
      { name: 'Incline Dumbbell Press',     sets: '3 x 10',      type: 'compound'  },
      { name: 'Cable Chest Fly',            sets: '3 x 12',      type: 'isolation' },
      { name: 'Tricep Pushdown (Cable)',    sets: '3 x 12',      type: 'isolation' },
      { name: 'Overhead Tricep Extension', sets: '3 x 12',      type: 'isolation' },
      { name: 'Close Grip Bench Press',    sets: '2 x 10',      type: 'compound'  },
    ]
  },
  1: {
    label: 'Back + Biceps',
    type: 'BCK',
    note: 'Compound: 90s rest | Isolation: 60s rest',
    exercises: [
      { name: 'Deadlift (form focus)',     sets: '4 x 6',       type: 'compound'  },
      { name: 'Bent Over Barbell Row',     sets: '3 x 10',      type: 'compound'  },
      { name: 'Lat Pulldown',              sets: '3 x 12',      type: 'compound'  },
      { name: 'Seated Cable Row',          sets: '3 x 12',      type: 'compound'  },
      { name: 'Barbell Curl',              sets: '3 x 12',      type: 'isolation' },
      { name: 'Hammer Curl',              sets: '2 x 15',      type: 'isolation' },
    ]
  },
  2: {
    label: 'Shoulders + Core',
    type: 'SHD',
    note: 'Compound: 90s rest | Isolation: 60s rest',
    exercises: [
      { name: 'Seated DB Overhead Press', sets: '4 x 10',      type: 'compound'  },
      { name: 'Lateral Raises',           sets: '4 x 15',      type: 'isolation' },
      { name: 'Front Raises',             sets: '3 x 12',      type: 'isolation' },
      { name: 'Face Pulls (Cable)',        sets: '3 x 15',      type: 'isolation' },
      { name: 'Plank',                    sets: '3 x 45s',     type: 'isolation' },
      { name: 'Hanging Leg Raises',       sets: '3 x 15',      type: 'isolation' },
    ]
  },
  3: {
    label: 'Legs',
    type: 'LEG',
    note: 'Compound: 90s rest | Isolation: 60s rest',
    exercises: [
      { name: 'Barbell Squat',            sets: '4 x 8',       type: 'compound'  },
      { name: 'Romanian Deadlift',        sets: '3 x 10',      type: 'compound'  },
      { name: 'Leg Press',                sets: '3 x 12',      type: 'compound'  },
      { name: 'Leg Curl Machine',         sets: '3 x 12',      type: 'isolation' },
      { name: 'Calf Raises',              sets: '4 x 20',      type: 'isolation' },
      { name: 'Walking Lunges',           sets: '2 x 12 each', type: 'compound'  },
    ]
  },
  4: {
    label: 'Chest + Back (Volume)',
    type: 'CHB',
    note: 'Light day — pump focus | 60s rest all exercises',
    exercises: [
      { name: 'Incline DB Press',         sets: '3 x 12',      type: 'isolation' },
      { name: 'DB Chest Fly',             sets: '3 x 15',      type: 'isolation' },
      { name: 'Cable Pullover',           sets: '3 x 12',      type: 'isolation' },
      { name: 'Wide Grip Lat Pulldown',   sets: '3 x 12',      type: 'compound'  },
      { name: 'One Arm DB Row',           sets: '3 x 12 each', type: 'compound'  },
      { name: 'Chest Supported Row',      sets: '3 x 12',      type: 'compound'  },
    ]
  },
  5: {
    label: 'Shoulders + Arms',
    type: 'ARM',
    note: 'Pump day — 60s rest all | Drop sets welcome',
    exercises: [
      { name: 'Arnold Press',             sets: '3 x 12',      type: 'compound'  },
      { name: 'Lateral Raises (drop set)',sets: '3 x 15',      type: 'isolation' },
      { name: 'Preacher Curl',            sets: '3 x 12',      type: 'isolation' },
      { name: 'Concentration Curl',       sets: '2 x 12 each', type: 'isolation' },
      { name: 'Skull Crushers',           sets: '3 x 12',      type: 'isolation' },
      { name: 'Tricep Dips (bench)',      sets: '3 x 15',      type: 'isolation' },
    ]
  },
  6: {
    label: 'Rest Day',
    type: 'REST',
    note: '10k steps + 3-4L paani + stretch karo',
    exercises: []
  }
};

const MEALS = [
  { name: 'Pre-Workout',          time: '5:00 AM',  desc: 'Nakpro Plant Protein 1 scoop + Paani + 5 Soaked Badam',                              cal: 145, prot: 22, carbs: 5,   fat: 4  },
  { name: 'Post-Workout Breakfast', time: '7:30 AM', desc: 'Full Fat Milk 500ml + Oats 50g',                                                    cal: 520, prot: 20, carbs: 57,  fat: 21 },
  { name: 'Snack 1',              time: '10:30 AM', desc: 'Ghar Ka Dahi 200g + Peanuts 30g',                                                    cal: 290, prot: 20, carbs: 12,  fat: 16 },
  { name: 'Lunch',                time: '1:00 PM',  desc: 'Besan+Moong Dal Chilla (50g+50g) + Ghar Ki Sabzi + Dahi 100g + 1 Roti',             cal: 500, prot: 37, carbs: 55,  fat: 8  },
  { name: 'Snack 2',              time: '4:30 PM',  desc: 'Soaked Chana 50g + Peanuts 20g',                                                     cal: 200, prot: 14, carbs: 22,  fat: 10 },
  { name: 'Dinner',               time: '7:30 PM',  desc: 'Besan+Moong Dal Chilla (50g+50g) + Ghar Ki Sabzi + Dahi 100g + 1 Roti',             cal: 500, prot: 37, carbs: 55,  fat: 8  },
  { name: 'Last Snack',           time: '8:30 PM',  desc: 'Omays Soya Beans 40g MAX -- 9 PM se pehle khatam karo!',                            cal: 125, prot: 14, carbs: 8,   fat: 4  },
];

const TOTAL_CALORIES = MEALS.reduce((s, m) => s + m.cal,   0);
const TOTAL_PROTEIN  = MEALS.reduce((s, m) => s + m.prot,  0);
const TOTAL_CARBS    = MEALS.reduce((s, m) => s + m.carbs, 0);
const TOTAL_FAT      = MEALS.reduce((s, m) => s + m.fat,   0);
const CALORIE_TARGET = Math.round(TOTAL_CALORIES * 0.8);
const PROTEIN_TARGET = Math.round(TOTAL_PROTEIN  * 0.8);

const DIET_TARGETS = {
  cal: TOTAL_CALORIES, prot: TOTAL_PROTEIN, carbs: TOTAL_CARBS, fat: TOTAL_FAT,
};
const DIET_RULES = [
  'Moong dal raat ko bhigo do -- subah grind karo chilla ke liye',
  'Pre-workout 5 AM pe lo -- khali pet gym mat jao',
  '9 PM ke baad bilkul kuch nahi khana',
  'Soya MAX 40g/day -- gyno risk at 22 years',
  'Pani 3-4 litre daily -- digestion + fat loss',
  '10k steps daily -- yahi tera main cardio hai',
  'Bhook lage toh 1 roti add karo -- warna nahi',
];

const DIET_COSTS = [
  { item: 'Full Fat Milk 500ml',  daily:  30, monthly:  900 },
  { item: 'Nakpro Whey Protein',  daily:  35, monthly: 1050 },
  { item: 'Oats 70g',             daily:  10, monthly:  300 },
  { item: 'Besan Chilla + Dahi',  daily:  20, monthly:  600 },
  { item: '4 Rotis + Sabzi',      daily:  20, monthly:  600 },
  { item: 'Raw Peanuts 50g',      daily:  15, monthly:  450 },
  { item: 'Soya Beans 40g',       daily:   5, monthly:  150 },
  { item: 'Banana x1',            daily:   5, monthly:  150 },
  { item: 'Misc / Extras',        daily:  14, monthly:  420 },
  { item: 'Gym Membership',       daily:  45, monthly: 1350 },
];
const DAILY_BUDGET   = 199;
const MONTHLY_BUDGET = 5970;

const SUPPLEMENTS = [
  { name: 'Creatine Monohydrate', dose: '3-5g daily',            time: 'Post-workout with water' },
  { name: 'Omega-3',              dose: '1-2g EPA+DHA',          time: 'Dinner with fat meal'    },
  { name: 'Vitamin D3 + K2',      dose: '1000-2000 IU D3',       time: 'Lunch with fat meal'     },
  { name: 'Vitamin B12',          dose: '500-1000mcg methylcob.', time: 'Morning with breakfast'  },
];

const XP_VALUES = {
  exercise:        10,
  meal:             8,
  supplement:       5,
  workoutComplete: 15,
  fullDayComplete: 25,
  waterGoal:       10,
};

const LEVELS = [
  { lvl: 1,  xp: 0,     name: 'Beginner'    },
  { lvl: 2,  xp: 100,   name: 'Consistent'  },
  { lvl: 3,  xp: 250,   name: 'Dedicated'   },
  { lvl: 4,  xp: 500,   name: 'Disciplined' },
  { lvl: 5,  xp: 1000,  name: 'Warrior'     },
  { lvl: 6,  xp: 2000,  name: 'Elite'       },
  { lvl: 7,  xp: 3500,  name: 'Beast Mode'  },
  { lvl: 8,  xp: 5500,  name: 'Anime Arc'   },
  { lvl: 9,  xp: 8000,  name: 'Mythic'      },
  { lvl: 10, xp: 12000, name: 'LEGENDARY'   },
];

const ACHIEVEMENTS = [
  { id: 'first_rep',    name: 'First Rep',     desc: 'Complete your first exercise',       icon: '&#9733;', color: 'go',   xpBonus: 20  },
  { id: 'first_meal',   name: 'Nourished',     desc: 'Log your first meal',                icon: '&#9829;', color: 'warn', xpBonus: 20  },
  { id: 'streak_3',     name: '3-Day Streak',  desc: '3 consecutive workout days',         icon: '&#9889;', color: 'fire', xpBonus: 30  },
  { id: 'week_warrior', name: 'Week Warrior',  desc: 'Complete a full 6-day week',         icon: '&#9996;', color: 'p',    xpBonus: 100 },
  { id: 'hydrated',     name: 'Hydrated',      desc: 'Hit 8 glasses of water in a day',   icon: '&#9675;', color: 'info', xpBonus: 15  },
  { id: 'supp_stack',   name: 'Supp Stack',    desc: 'Take all 4 supplements in one day', icon: '&#9670;', color: 'warn', xpBonus: 25  },
  { id: 'push_king',    name: 'Push King',     desc: '3 push workout days completed',      icon: '&#9650;', color: 'fire', xpBonus: 50  },
  { id: 'pull_master',  name: 'Pull Master',   desc: '3 pull workout days completed',      icon: '&#9658;', color: 'go',   xpBonus: 50  },
  { id: 'leg_hero',     name: 'Leg Day Hero',  desc: '3 leg days completed',               icon: '&#9660;', color: 'warn', xpBonus: 50  },
  { id: 'streak_7',     name: 'Iron Will',     desc: '7-day streak achieved',              icon: '&#9830;', color: 'fire', xpBonus: 75  },
  { id: 'streak_14',    name: '2-Week Grind',  desc: '14-day streak achieved',             icon: '&#9812;', color: 'p',    xpBonus: 150 },
  { id: 'streak_30',    name: '30-Day Beast',  desc: '30-day streak achieved',             icon: '&#9819;', color: 'p',    xpBonus: 500 },
  { id: 'calorie_5',    name: 'Calorie King',  desc: 'Hit calorie target 5 days',          icon: '&#9827;', color: 'fire', xpBonus: 50  },
  { id: 'protein_7',    name: 'Protein God',   desc: 'Hit protein target 7 days',          icon: '&#9824;', color: 'go',   xpBonus: 75  },
  { id: 'hybrid_week',  name: 'Hybrid Elite',  desc: 'Gym + cali in the same week',        icon: '&#9835;', color: 'p',    xpBonus: 100 },
  { id: 'level_8',      name: 'Anime Arc',     desc: 'Reach Level 8',                      icon: '&#9999;', color: 'p',    xpBonus: 200 },
];

const USER_PROFILE = {
  name:        'Abhishek Yadav',
  weight:      80,
  height:      177,
  age:         22,
  goal:        'recomp',
  diet:        'vegetarian',
  joinDate:    '2026-06-25',
  targetDate:  '2026-09-20',
};

const GOAL_DATE = new Date('2026-09-20T00:00:00');
const JOIN_DATE = new Date('2026-06-25T00:00:00');

const SKILL_TREE = {
  push: {
    label: 'PUSH PATH',
    nodes: [
      { name: 'Normal Push-ups',  tag: 'NOW'    },
      { name: 'Pike Push-ups',    tag: 'WEEK 2' },
      { name: 'Wall HSPU',        tag: 'WEEK 8' },
      { name: 'HSPU',             tag: 'GOAL'   },
    ]
  },
  pull: {
    label: 'PULL PATH',
    nodes: [
      { name: 'Dead Hang',           tag: 'NOW'    },
      { name: 'Negative Pull-ups',   tag: 'WEEK 2' },
      { name: '1 Pull-up',           tag: 'WEEK 8' },
      { name: '10 Pull-ups',         tag: 'GOAL'   },
    ]
  },
  core: {
    label: 'CORE PATH',
    nodes: [
      { name: 'Plank 30s',    tag: 'NOW'    },
      { name: 'Plank 60s',    tag: 'WEEK 3' },
      { name: 'Hollow Body',  tag: 'WEEK 6' },
      { name: 'L-sit',        tag: 'GOAL'   },
    ]
  },
};

const PULLUP_PLAN = [
  { week: 'Week 1-2', focus: 'Dead Hang 4x20s + Australian Rows 4x8'  },
  { week: 'Week 3-4', focus: 'Negative Pull-ups 3x5 + Dead Hang 3x30s' },
  { week: 'Week 5-6', focus: 'Band-Assisted Pull-ups 3x5-8'            },
  { week: 'Week 7-8', focus: 'First unassisted pull-up!'               },
];

const QUOTES = [
  { text: 'The body achieves what the mind believes.',                       author: 'Napoleon Hill' },
  { text: '86 days. One goal. No excuses.',                                  author: 'Your Trainer'  },
  { text: 'Every rep brings you closer to your best self.',                  author: 'Your Trainer'  },
  { text: 'Pain is temporary. Anime physique is eternal.',                   author: 'Your Trainer'  },
  { text: 'Champions are made in the moments you want to quit.',             author: 'Unknown'       },
  { text: 'The only bad workout is the one that did not happen.',            author: 'Unknown'       },
  { text: 'Discipline is choosing what you want most over what you want now.', author: 'Unknown'     },
  { text: 'Your future self is watching. Do not disappoint him.',            author: 'Your Trainer'  },
  { text: 'Train like the protagonist of your own anime.',                   author: 'Your Trainer'  },
  { text: 'Sep 20 is coming. Be ready.',                                     author: 'Your Trainer'  },
];
