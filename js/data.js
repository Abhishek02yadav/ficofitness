// FicoFit V2 FINAL — Data Layer — NO EMOJI IN THIS FILE
const DAYS      = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_FOCUS = ['Gym Push','Gym Pull','Gym Legs','Cali Push','Cali Pull','Hybrid','Rest'];
const DAY_LABEL = ['GYM','GYM','GYM','CALI','CALI','HYB','REST'];
const DAY_TYPE  = ['push','pull','legs','push','pull','hybrid','rest'];

const WORKOUTS = {
  0: {
    label: 'Push Day — Gym',
    type: 'GYM',
    exercises: [
      { name: 'Barbell Bench Press',         sets: '4 x 8'   },
      { name: 'Incline DB Press',             sets: '3 x 10'  },
      { name: 'Lateral Raises',               sets: '3 x 15'  },
      { name: 'OHP Seated DB',                sets: '3 x 10'  },
      { name: 'Tricep Pushdown',              sets: '3 x 12'  },
      { name: 'Overhead Tricep Extension',    sets: '2 x 15'  },
    ]
  },
  1: {
    label: 'Pull Day — Gym',
    type: 'GYM',
    exercises: [
      { name: 'Deadlift (form focus)',        sets: '4 x 6'   },
      { name: 'Bent Over Row',                sets: '3 x 10'  },
      { name: 'Lat Pulldown',                 sets: '3 x 12'  },
      { name: 'Face Pulls',                   sets: '3 x 15'  },
      { name: 'Barbell Curl',                 sets: '3 x 12'  },
      { name: 'Hammer Curl',                  sets: '2 x 15'  },
    ]
  },
  2: {
    label: 'Legs — Gym',
    type: 'GYM',
    exercises: [
      { name: 'Squat',                        sets: '4 x 8'   },
      { name: 'Romanian Deadlift',            sets: '3 x 10'  },
      { name: 'Leg Press',                    sets: '3 x 12'  },
      { name: 'Leg Curl Machine',             sets: '3 x 12'  },
      { name: 'Calf Raises',                  sets: '4 x 20'  },
      { name: 'Plank',                        sets: '3 x 45s' },
    ]
  },
  3: {
    label: 'Push — Calisthenics',
    type: 'CALI',
    exercises: [
      { name: 'Push-ups (full ROM)',          sets: '4 x 10-15' },
      { name: 'Pike Push-ups',                sets: '3 x 8'     },
      { name: 'Bench Dips / Bar Dips',        sets: '3 x 8-10'  },
      { name: 'Diamond Push-ups',             sets: '3 x 8'     },
      { name: 'Wall Plank Hold',              sets: '3 x 20s'   },
      { name: 'Incline Push-up to Failure',   sets: '1 x AMRAP' },
    ]
  },
  4: {
    label: 'Pull — Calisthenics',
    type: 'CALI',
    exercises: [
      { name: 'Dead Hang',                    sets: '4 x 15-20s' },
      { name: 'Australian Rows (Inv. Rows)',  sets: '4 x 8-10'   },
      { name: 'Scapula Pull-ups',             sets: '3 x 8'      },
      { name: 'Negative Pull-ups (slow)',     sets: '3 x 3-5'    },
      { name: 'Hanging Knee Raises',          sets: '3 x 10'     },
    ]
  },
  5: {
    label: 'Hybrid Full Body',
    type: 'HYB',
    exercises: [
      { name: 'Weighted Pull-ups / Muscle-up Neg', sets: '3 x 5'      },
      { name: 'DB Lunges',                         sets: '3 x 12 each' },
      { name: 'Archer Push-ups',                   sets: '3 x 10'     },
      { name: 'Cable Rows',                        sets: '3 x 12'     },
      { name: 'Hollow Body Hold',                  sets: '3 x 30s'    },
      { name: 'V-ups',                             sets: '3 x 15'     },
    ]
  },
  6: { label: 'Rest Day', type: 'REST', exercises: [] }
};

const MEALS = [
  { name: 'Breakfast',  time: '8:00 AM',  desc: 'Full Fat Milk 500ml + Nakpro Protein 1 scoop + Oats 70g + Banana 1', cal: 805, prot: 52, carbs: 103, fat: 24 },
  { name: 'Snack 1',    time: '11:00 AM', desc: 'Besan Chilla 100g + Ghar Ka Dahi 150g',                               cal: 475, prot: 23, carbs: 65,  fat: 12 },
  { name: 'Lunch',      time: '1:30 PM',  desc: '2 Roti + Ghar Ki Sabzi + Dahi 100g',                                  cal: 415, prot: 12, carbs: 70,  fat: 10 },
  { name: 'Snack 2',    time: '5:00 PM',  desc: 'Raw Peanuts 50g',                                                     cal: 290, prot: 13, carbs: 8,   fat: 25 },
  { name: 'Dinner',     time: '8:00 PM',  desc: '2 Roti + Ghar Ki Sabzi + Dahi 100g',                                  cal: 415, prot: 12, carbs: 70,  fat: 10 },
  { name: 'Last Snack', time: '9:30 PM',  desc: 'Omays Soya Beans 40g MAX',                                            cal: 125, prot: 14, carbs: 8,   fat: 4  },
];

const TOTAL_CALORIES = MEALS.reduce((s, m) => s + m.cal,  0);  // 2525
const TOTAL_PROTEIN  = MEALS.reduce((s, m) => s + m.prot, 0);  // 126
const CALORIE_TARGET = Math.round(TOTAL_CALORIES * 0.8);       // 2020
const PROTEIN_TARGET = Math.round(TOTAL_PROTEIN  * 0.8);       // 101

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
