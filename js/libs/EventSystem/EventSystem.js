class EventSystem
{
    static #switches = new Map();
    static #variables = new Map();

    static dialogueBox = null;
    static dialogueChoiceBox = null;
    static illustrator = null;

    static #AddSwitch (name)
    {
        this.#switches.set(name, false);
    }

    static #AddVariable (name)
    {
        this.#variables.set(name, 0);
    }

    static Init ()
    {
        // ----------------------------------------- SWITCHES

        this.#AddSwitch("harp");                  // 0001
        this.#AddSwitch("traveller");             // 0002
        this.#AddSwitch("traveller_help");        // 0003
        this.#AddSwitch("traveller_done");        // 0004
        this.#AddSwitch("traveller_no");          // 0005
        this.#AddSwitch("traveller_lake");        // 0006
        this.#AddSwitch("lake_creature");         // 0007
        this.#AddSwitch("traveller_c1");          // 0008
        this.#AddSwitch("traveller_c2");          // 0009
        this.#AddSwitch("traveller_c3");          // 0010
        this.#AddSwitch("cave_secret");           // 0011
        this.#AddSwitch("carriage");              // 0012
        this.#AddSwitch("fire_wall_1");           // 0013
        this.#AddSwitch("fire_wall_2");           // 0014
        this.#AddSwitch("fire_chestb4solve");     // 0015
        this.#AddSwitch("fire_enemy_1");          // 0016
        this.#AddSwitch("fire_enemy_2");          // 0017
        this.#AddSwitch("fire_puzzlereset");      // 0018
        this.#AddSwitch("ice_void");              // 0019
        this.#AddSwitch("touchedgrass");          // 0020

        this.#AddSwitch("zera_left");             // 0021
        this.#AddSwitch("claire");                // 0022
        this.#AddSwitch("claire_quest");          // 0023
        this.#AddSwitch("doc");                   // 0024
        this.#AddSwitch("claire_quest_done");     // 0025
        this.#AddSwitch("claire_broom");          // 0026
        this.#AddSwitch("claire_fly");            // 0027
        this.#AddSwitch("woof_sleep_1");          // 0028
        this.#AddSwitch("woof_sleep_2");          // 0029
        this.#AddSwitch("woof_sleep_3");          // 0030
        this.#AddSwitch("aimottle_1");            // 0031
        this.#AddSwitch("aimottle_2");            // 0032
        this.#AddSwitch("viewed");                // 0033
        this.#AddSwitch("claire_poster");         // 0034
        this.#AddSwitch("stump");                 // 0035
        this.#AddSwitch("caina_cafe");            // 0036
        this.#AddSwitch("sign");                  // 0037
        this.#AddSwitch("zera_athousescene");     // 0038
        this.#AddSwitch("tree_letter");           // 0039
        this.#AddSwitch("snek");                  // 0040

        this.#AddSwitch("lighthouse");            // 0041
        this.#AddSwitch("pier");                  // 0042
        this.#AddSwitch("prince_1");              // 0043
        this.#AddSwitch("prince_2");              // 0044
        this.#AddSwitch("prince_3");              // 0045
        this.#AddSwitch("prince_4");              // 0046
        this.#AddSwitch("prince_index");          // 0047
        this.#AddSwitch("tailor");                // 0048
        this.#AddSwitch("tailor_dress");          // 0049
        this.#AddSwitch("treasure");              // 0050
        this.#AddSwitch("prince_parents_1");      // 0051
        this.#AddSwitch("prince_parents_2");      // 0052
        this.#AddSwitch("???");                   // 0053
        this.#AddSwitch("caina_appeared");        // 0054
        this.#AddSwitch("stump_touched");         // 0055
        this.#AddSwitch("caina_sparred");         // 0056
        this.#AddSwitch("j*b");                   // 0057
        this.#AddSwitch("j*bbing");               // 0058
        this.#AddSwitch("j*bbed");                // 0059
        this.#AddSwitch("j*bbed_good");           // 0060

        this.#AddSwitch("letter_house_1");        // 0061
        this.#AddSwitch("letter_house_2");        // 0062
        this.#AddSwitch("letter_house_3");        // 0063
        this.#AddSwitch("letter_mail_1");         // 0064
        this.#AddSwitch("letter_mail_2");         // 0065
        this.#AddSwitch("letter_mail_3");         // 0066
        this.#AddSwitch("traveller_village");     // 0067
        this.#AddSwitch("kitty_fight");           // 0068
        this.#AddSwitch("kitty_cat");             // 0069
        this.#AddSwitch("kitty_bye");             // 0070
        this.#AddSwitch("zera_manor");            // 0071
        this.#AddSwitch("dragon_noticed");        // 0072
        this.#AddSwitch("dragon_forest");         // 0073
        this.#AddSwitch("dragon_deeper");         // 0074
        this.#AddSwitch("dragon_transformed");    // 0075
        this.#AddSwitch("dragon_done");           // 0076
        this.#AddSwitch("dragon_talked");         // 0077
        this.#AddSwitch("zera_drink");            // 0078
        this.#AddSwitch("drink");                 // 0079
        this.#AddSwitch("heroes_set");            // 0080

        this.#AddSwitch("heroes_otherland");      // 0081
        this.#AddSwitch("adventure_start");       // 0082
        this.#AddSwitch("heroes");                // 0083
        this.#AddSwitch("claire_joins");          // 0084
        this.#AddSwitch("claire_here");           // 0085
        this.#AddSwitch("heroes_betrayel");       // 0086
        this.#AddSwitch("heroes_fight");          // 0087
        this.#AddSwitch("save");                  // 0088
        this.#AddSwitch("adventure_nohotspring"); // 0089
        this.#AddSwitch("adventure_armored");     // 0090
        this.#AddSwitch("heroes_reunite");        // 0091
        this.#AddSwitch("adventure_dizzy");       // 0092
        this.#AddSwitch("adventure_creeps");      // 0093
        this.#AddSwitch("adventure_done");        // 0094
        this.#AddSwitch("heroes_rogue");          // 0095
        this.#AddSwitch("este_warp");             // 0096
        this.#AddSwitch("journal_a");             // 0097
        this.#AddSwitch("journal_b");             // 0098
        this.#AddSwitch("leftroom");              // 0099
        this.#AddSwitch("journal_pages_1");       // 0100

        this.#AddSwitch("journal_pages_2");       // 0101
        this.#AddSwitch("journal_pages_3");       // 0102
        this.#AddSwitch("journal_done");          // 0103
        this.#AddSwitch("claire_concern");        // 0104
        this.#AddSwitch("bird_form");             // 0105
        this.#AddSwitch("tem_speach");            // 0106
        this.#AddSwitch("tem_gone");              // 0107
        this.#AddSwitch("woof_venture");          // 0108
        this.#AddSwitch("soldier_overheard");     // 0109
        this.#AddSwitch("librarian");             // 0110
        this.#AddSwitch("blacksmith");            // 0111
        this.#AddSwitch("captain");               // 0112
        this.#AddSwitch("soldier_annoying");      // 0113
        this.#AddSwitch("villager_1");            // 0114
        this.#AddSwitch("villager_2");            // 0115
        this.#AddSwitch("villager_3");            // 0116
        this.#AddSwitch("villager_4");            // 0117
        this.#AddSwitch("soldier_talk_1");        // 0118
        this.#AddSwitch("sailor_1");              // 0119
        this.#AddSwitch("sailor_2");              // 0120

        this.#AddSwitch("sailor_3");              // 0121
        this.#AddSwitch("sailor_4");              // 0122
        this.#AddSwitch("sailor_talk_10");        // 0123
        this.#AddSwitch("townsman_1");            // 0124
        this.#AddSwitch("townsman_2");            // 0125
        this.#AddSwitch("townsman_3");            // 0126
        this.#AddSwitch("townsman_4");            // 0127
        this.#AddSwitch("townsman_5");            // 0128
        this.#AddSwitch("townsman_6");            // 0129
        this.#AddSwitch("sailor_talk_11");        // 0130
        this.#AddSwitch("sailor_talk_12");        // 0131
        this.#AddSwitch("guard_1");               // 0132
        this.#AddSwitch("maid_1");                // 0133
        this.#AddSwitch("guard_2");               // 0134
        this.#AddSwitch("highknight");            // 0135
        this.#AddSwitch("sacredknight");          // 0136
        this.#AddSwitch("guard_3");               // 0137
        this.#AddSwitch("guard_4");               // 0138
        this.#AddSwitch("guard_5");               // 0139
        this.#AddSwitch("guard_6");               // 0140

        this.#AddSwitch("guard_7");               // 0141
        this.#AddSwitch("butler_1");              // 0142
        this.#AddSwitch("maid_2");                // 0143
        this.#AddSwitch("chef");                  // 0144
        this.#AddSwitch("butler_2");              // 0145
        this.#AddSwitch("soldier_reluctance");    // 0146
        this.#AddSwitch("soldier_talk_20");       // 0147
        this.#AddSwitch("soldier_talk_21");       // 0148
        this.#AddSwitch("soldier_talk_22");       // 0149
        this.#AddSwitch("zera_crystal");          // 0150
        this.#AddSwitch("fbuttler_1");            // 0151
        this.#AddSwitch("fbuttler_2");            // 0152
        this.#AddSwitch("fmaid_3");               // 0153
        this.#AddSwitch("fbuttler_castle");       // 0154
        this.#AddSwitch("fbuttler_kitchen");      // 0155
        this.#AddSwitch("fbuttler_4");            // 0156
        this.#AddSwitch("fmaid_4");               // 0157
        this.#AddSwitch("fbuttler_5");            // 0158
        this.#AddSwitch("frog");                  // 0159
        this.#AddSwitch("forestsoldier_1");       // 0160

        this.#AddSwitch("forestsoldier_2");       // 0161
        this.#AddSwitch("zera_bonus");            // 0162
        this.#AddSwitch("claire_journal");        // 0163
        this.#AddSwitch("chest");                 // 0164
        this.#AddSwitch("butterfly");             // 0165
        this.#AddSwitch("aimottle_nigerundayo");  // 0166


        // ----------------------------------------- VARIABLES

        this.#AddVariable("harp");                // 0001
        this.#AddVariable("traveller_lost");      // 0002
        this.#AddVariable("zera_manor");          // 0003
        this.#AddVariable("illusts");             // 0004
        this.#AddVariable("hors");                // 0005
        this.#AddVariable("carriage_addiction");  // 0006
        this.#AddVariable("claire_go");           // 0007
        this.#AddVariable("zera_athouse");        // 0008
        this.#AddVariable("zera_talkcount");      // 0009
        this.#AddVariable("letters_delivered");   // 0010
        this.#AddVariable("hellbed");             // 0011
        this.#AddVariable("her");                 // 0012
        this.#AddVariable("tem_jump");            // 0013
    }

    static async Run (id)
    {
        switch (id)
        {
            case "hintbird": {
                GameObject.Find("char_hintbird").GetComponent(RPGMovement).LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[2], true);
                
                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_choices`)[0],
                    LocaleManager.Find(`${id}_choices`)[1]
                ], 1);

                if (choice === 1);
                else if (!this.GetSwitch("zera_athousescene"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_zera`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_zera`)[1]);
                }
                else if (!this.GetSwitch("traveller_done")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                else if (this.GetVariable("carriage_addiction") < 1)
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_carriage`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_carriage`)[1]);
                }
                else if (!this.GetSwitch("claire")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_claire`));
                else if (!this.GetSwitch("claire_quest")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_claire_quest`));
                else if (!this.GetSwitch("claire_quest_done"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_claire_quest_wait`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_claire_quest_wait`)[1]);
                }
                else if (!this.GetSwitch("claire_fly")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_claire_fly`));
                else if (!this.GetSwitch("woof_sleep_1")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_woof`));
                else if (!this.GetSwitch("aimottle_1")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_aimottle`));
                else if (!this.GetSwitch("viewed")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_view`));
                else if (!this.GetSwitch("claire_poster")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_claire_poster`));
                else if (!this.GetSwitch("stump")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_stump`));
                else if (!this.GetSwitch("caina_cafe")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_caina_cafe`));
                else if (!this.GetSwitch("sign"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_sign`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_sign`)[1]);
                }
                else if (!this.GetSwitch("tree_letter"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_letter`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_letter`)[1]);
                }
                else if (!this.GetSwitch("snek"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_snek`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_snek`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_snek`)[2]);
                }
                else if (!this.GetSwitch("lighthouse"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_lighthouse`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_lighthouse`)[1]);
                }
                else if (!this.GetSwitch("pier")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_pier`));
                else if (!this.GetSwitch("prince_1")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_prince`));
                else if (!this.GetSwitch("prince_index")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_prince_index`));
                else if (!this.GetSwitch("tailor_dress")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_dress`));
                else if (!this.GetSwitch("butterfly"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_butterfly`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_butterfly`)[1]);
                }
                else if (!this.GetSwitch("treasure")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_treasure`));
                else if (!this.GetSwitch("prince_parents_1")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_prince_parents`));
                else if (!this.GetSwitch("???"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_???`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_???`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_???`)[2]);
                }
                else if (!this.GetSwitch("caina_sparred"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_caina_spar`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_caina_spar`)[1]);
                }
                else if (!this.GetSwitch("j*bbed_good"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_j*b`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_j*b`)[1]);
                }
                else if (!this.GetSwitch("kitty_cat"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_kitty`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_kitty`)[1]);
                }
                else if (!this.GetSwitch("dragon_forest"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_shrine`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_shrine`)[1]);
                }
                else if (!this.GetSwitch("dragon_done"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_dragon`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_dragon`)[1]);
                }
                else if (!this.GetSwitch("drink")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_drink`));
                else if (!this.GetSwitch("adventure_done"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_adventure`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_adventure`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_adventure`)[2]);
                }
                else if (!this.GetSwitch("journal_done"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_journal`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_journal`)[1]);
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_done`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_done`)[1]);
                }

                await this.dialogueBox.Close();
                } break;

            // ------------------------------------------------------- yokihouse
            case "yolkhouse_mail":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "yolkhouse_veggie":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "yolkhouse_well":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                await this.dialogueBox.Close();
                break;
            case "yolkhouse_zera":
                GameObject.Find("char_zera").GetComponent(RPGMovement).LookAtChar(Player.instance);

                if (this.GetSwitch("zera_athousescene"))
                {
                    this.dialogueBox.SetFace("yoki", "annoyed");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_leave`)[0]);
                    this.dialogueBox.SetFace("zera", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_leave`)[1]);
                    this.dialogueBox.SetFace("yoki", "annoyed");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_leave`)[2]);
                    await this.dialogueBox.Close();

                    return;
                }

                this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await EventSystem.Timer(9);
                this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await EventSystem.Timer(9);
                this.TintAll(new Color(-1, -1, -1, 0));
                await EventSystem.Timer(1);

                this.illustrator.Set(0, "zera_talk_1", 50 / 255);
                await EventSystem.Timer(8);
                this.illustrator.Set(0, "zera_talk_1", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(0, "zera_talk_1", 1);
                await EventSystem.Timer(21);
                
                this.dialogueBox.SetFace("yoki", "upset");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);

                this.illustrator.Set(1, "zera_talk_2", 50 / 255);
                await EventSystem.Timer(8);
                this.illustrator.Set(1, "zera_talk_2", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(1, "zera_talk_2", 1);
                this.illustrator.Clear(0);
                await EventSystem.Timer(21);

                this.dialogueBox.SetFace("zera", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);

                this.illustrator.Set(0, "zera_talk_3", 50 / 255);
                await EventSystem.Timer(8);
                this.illustrator.Set(0, "zera_talk_3", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(0, "zera_talk_3", 1);
                this.illustrator.Clear(1);
                await EventSystem.Timer(21);

                this.dialogueBox.SetFace("zera", "pout");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);

                this.illustrator.Set(1, "zera_talk_2", 50 / 255);
                await EventSystem.Timer(8);
                this.illustrator.Set(1, "zera_talk_2", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(1, "zera_talk_2", 1);
                this.illustrator.Clear(0);
                await EventSystem.Timer(21);

                this.dialogueBox.SetFace("zera", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);

                this.illustrator.Set(0, "zera_talk_3", 50 / 255);
                await EventSystem.Timer(8);
                this.illustrator.Set(0, "zera_talk_3", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(0, "zera_talk_3", 1);
                this.illustrator.Clear(1);
                await EventSystem.Timer(21);

                this.dialogueBox.SetFace("zera", "pout");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                this.dialogueBox.SetFace("zera", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[11]);
                this.dialogueBox.SetFace("zera", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[12]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[13]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[14]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[15]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[16]);

                this.illustrator.Set(1, "zera_talk_2", 50 / 255);
                await EventSystem.Timer(8);
                this.illustrator.Set(1, "zera_talk_2", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(1, "zera_talk_2", 1);
                this.illustrator.Clear(0);
                await EventSystem.Timer(21);

                this.dialogueBox.SetFace("zera", "pout");
                await this.dialogueBox.Type(LocaleManager.Find(id)[17]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[18]);

                this.illustrator.Set(0, "zera_talk_3", 50 / 255);
                await EventSystem.Timer(8);
                this.illustrator.Set(0, "zera_talk_3", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(0, "zera_talk_3", 1);
                this.illustrator.Clear(1);
                await EventSystem.Timer(21);

                this.dialogueBox.SetFace("zera", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[19]);

                this.illustrator.Set(0, "zera_talk_3", 100 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Set(0, "zera_talk_3", 50 / 255);
                await EventSystem.Timer(9);
                this.illustrator.Clear(0);
                await EventSystem.Timer(20);

                this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await EventSystem.Timer(9);
                this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await EventSystem.Timer(9);
                this.TintAll(Color.clear);
                await EventSystem.Timer(1);

                this.SetSwitch("zera_athousescene", true);
                this.AddToVariable("zera_talkcount");
                this.AddToVariable("illusts");
                break;

            // ------------------------------------------------------- forest_barrier
            case "aimottle_mail":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "forestbarrier_fox1": {
                const fox = GameObject.Find("char_fox1").GetComponent(RPGMovement);
                
                fox.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
                } break;
            case "forestbarrier_fox2":
                GameObject.Find("char_fox2").GetComponent(RPGMovement).LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "forestbarrier_squirrel1": {
                const squirrel = GameObject.Find("char_squirrel1").GetComponent(RPGMovement);
                const randMove = squirrel.GetComponent(RandomMove);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                squirrel.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();
                randMove.enabled = true;
                randMove.ResetTime();
                } break;
            case "forestbarrier_squirrel2":
                GameObject.Find("char_squirrel2").GetComponent(RPGMovement).LookAtChar(Player.instance);

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "forestbarrier_squirrel3": {
                const squirrel = GameObject.Find("char_squirrel3").GetComponent(RPGMovement);
                const randMove = squirrel.GetComponent(RandomMove);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                squirrel.LookAt(Vector2.left);
                await this.Timer(2);
                squirrel.LookAt(Vector2.up);
                await this.Timer(2);
                squirrel.LookAt(Vector2.right);
                await this.Timer(2);
                squirrel.LookAt(Vector2.down);
                await this.Timer(2);
                squirrel.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();
                randMove.enabled = true;
                randMove.ResetTime();
                } break;
            case "forestbarrier_deer": {
                const deer = GameObject.Find("char_deer").GetComponent(RPGMovement);

                deer.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
                } break;
            case "forestbarrier_bird": {
                const bird = GameObject.Find("char_bird").GetComponent(RPGMovement);
                const randMove = bird.GetComponent(RandomMove);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                const lookingAt = bird.lookingAt;
                bird.LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();

                bird.LookAt(lookingAt);
                randMove.enabled = true;
                randMove.ResetTime();
                } break;
        }
    }

    static async 

    static async DialogueChoice (choices, nahChoice)
    {
        this.dialogueChoiceBox.transform.parent = GameObject.Find("camera")?.transform;
        this.dialogueChoiceBox.Clear();
        this.dialogueChoiceBox.nahChoice = nahChoice;

        let output = 0;
        let doneCall = () => { };
        
        for (let i = 0; i < choices.length; i++) this.dialogueChoiceBox.AddChoice(choices[i], () => {
            output = i;
            doneCall();
        });

        await CrystalEngine.Wait(() => this.dialogueChoiceBox.setDimensions);

        this.dialogueChoiceBox.transform.localPosition = new Vector2(
            0.5 * (this.dialogueBox.spriteRenderer.size.x - this.dialogueChoiceBox.spriteRenderer.size.x),
            -4.5 + this.dialogueChoiceBox.spriteRenderer.size.y * 0.5 + this.dialogueBox.spriteRenderer.size.y
        );

        this.dialogueChoiceBox.Open();

        await new Promise(resolve => doneCall = resolve);

        this.dialogueChoiceBox.Close();

        return output;
    }

    static async Timer (duration)
    {
        duration = duration / 60;

        if (duration < Time.deltaTime) return;

        let time = 0;
        let endCallback = () => { };

        const updateCallback = () => {
            time += Time.deltaTime;

            if (time < duration) return;

            PlayerLoop.onAfterUpdate.Remove(updateCallback);
            endCallback();
        };
        PlayerLoop.onAfterUpdate.Add(updateCallback);

        await new Promise(resolve => endCallback = resolve);
    }

    static async WaitFrameEnd ()
    {
        await new Promise(resolve => {
            const callback = () => {
                PlayerLoop.onFrameEnd.Remove(callback);
                resolve();
            };
            PlayerLoop.onFrameEnd.Add(callback);
        });
    }

    static TintAll (color)
    {
        const renderers = GameObject.FindComponents(Renderer).filter(item => !([4, 5]).includes(item.sortingLayer));

        for (let i = 0; i < renderers.length; i++) renderers[i].tint = color;
    }

    static GetSwitch (name)
    {
        return this.#switches.get(name);
    }

    static GetVariable (name)
    {
        return this.#variables.get(name);
    }

    static SetSwitch (name, state)
    {
        return this.#switches.set(name, state);
    }

    static SetVariable (name, value)
    {
        return this.#variables.set(name, value);
    }

    static AddToVariable (name, amount = 1)
    {
        this.SetVariable(name, this.GetVariable(name) + amount);
    }

    static SwitchesSave ()
    {
        return Array.from(this.#switches).map(item => item[1]);
    }

    static VariablesSave ()
    {
        return Array.from(this.#variables).map(item => item[1]);
    }

    static LoadSwitches (data)
    {
        let i = 0;

        this.#switches.forEach((value, key) => {
            this.#switches.set(key, data[i]);
            i++;
        });
    }

    static LoadVariables (data)
    {
        let i = 0;

        this.#variables.forEach((value, key) => {
            this.#variables.set(key, data[i]);
            i++;
        });
    }
}

EventSystem.Init();