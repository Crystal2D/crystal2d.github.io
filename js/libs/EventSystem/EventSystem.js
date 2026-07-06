class EventSystem
{
    static #switches = new Map();
    static #variables = new Map();

    static onBeforeUpdate = new DelegateEvent();
    static onUpdate = new DelegateEvent();

    static dialogueBox = null;
    static dialogueChoiceBox = null;
    static illustrator = null;

    static get switchCount ()
    {
        return this.#switches.size;
    }

    static get variableCount ()
    {
        return this.#variables.size;
    }

    static async #ProcessCommonEvents ()
    {
        // Delivering Letters
        if (this.GetSwitch("j*bbing") && this.GetVariable("letters_delivered") === 3)
        {
            this.dialogueBox.CancelClose();
            this.dialogueBox.SetFace("yoki", "neutral");
            await this.dialogueBox.Type(LocaleManager.Find("j*bbed")[0]);
            this.dialogueBox.SetFace("yoki", "look");
            await this.dialogueBox.Type(LocaleManager.Find("j*bbed")[1]);
            this.dialogueBox.Close();

            this.SetSwitch("j*bbed", true);
            this.SetSwitch("j*bbing", false);
        }

        // Journal Entries
        if (this.GetSwitch("leftroom"))
        {
            if (!this.GetSwitch("journal_pages_1") && this.GetVariable("illusts") === 10)
            {
                AudioManager.instance.SaveBGM();
                AudioManager.instance.FadeOutBGM(1);

                this.dialogueBox.CancelClose();
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find("journal_1")[0]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find("journal_1")[1]);

                AudioManager.instance.PlaySE("journal", 0.2);

                await this.dialogueBox.Type(LocaleManager.Find("journal_1")[2]);
                this.dialogueBox.Close();

                AudioManager.instance.ReplayBGM();
                this.SetSwitch("journal_pages_1", true);
            }

            if (!this.GetSwitch("journal_pages_2") && this.GetVariable("illusts") === 20)
            {
                AudioManager.instance.SaveBGM();
                AudioManager.instance.FadeOutBGM(1);

                this.dialogueBox.CancelClose();
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find("journal_2")[0]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find("journal_2")[1]);

                AudioManager.instance.PlaySE("journal", 0.2);

                await this.dialogueBox.Type(LocaleManager.Find("journal_2")[2]);
                this.dialogueBox.Close();

                AudioManager.instance.ReplayBGM();
                this.SetSwitch("journal_pages_2", true);
            }

            if (!this.GetSwitch("journal_pages_3") && this.GetVariable("illusts") === 31)
            {
                AudioManager.instance.SaveBGM();
                AudioManager.instance.FadeOutBGM(1);

                this.dialogueBox.CancelClose();
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find("journal_3")[0]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find("journal_3")[1]);

                AudioManager.instance.PlaySE("journal", 0.2);

                await this.dialogueBox.Type(LocaleManager.Find("journal_3")[2]);
                this.dialogueBox.Close();

                AudioManager.instance.ReplayBGM();
                this.SetSwitch("journal_pages_3", true);
            }
        }
    }

    static AddSwitch (name)
    {
        this.#switches.set(name, false);
    }

    static AddVariable (name)
    {
        this.#variables.set(name, 0);
    }

    static Init ()
    {
        // #region ----------------------------------------- SWITCHES

        this.AddSwitch("harp");                  // 0001
        this.AddSwitch("traveller");             // 0002
        this.AddSwitch("traveller_help");        // 0003
        this.AddSwitch("traveller_done");        // 0004
        this.AddSwitch("traveller_no");          // 0005
        this.AddSwitch("traveller_lake");        // 0006
        this.AddSwitch("lake_creature");         // 0007
        this.AddSwitch("traveller_c1");          // 0008
        this.AddSwitch("traveller_c2");          // 0009
        this.AddSwitch("traveller_c3");          // 0010
        this.AddSwitch("cave_secret");           // 0011
        this.AddSwitch("carriage");              // 0012
        this.AddSwitch("fire_wall_1");           // 0013
        this.AddSwitch("fire_wall_2");           // 0014
        this.AddSwitch("fire_chestb4solve");     // 0015
        this.AddSwitch("fire_enemy_1");          // 0016
        this.AddSwitch("fire_enemy_2");          // 0017
        this.AddSwitch("fire_puzzlereset");      // 0018
        this.AddSwitch("ice_void");              // 0019
        this.AddSwitch("touchedgrass");          // 0020

        this.AddSwitch("zera_left");             // 0021
        this.AddSwitch("claire");                // 0022
        this.AddSwitch("claire_quest");          // 0023
        this.AddSwitch("doc");                   // 0024
        this.AddSwitch("claire_quest_done");     // 0025
        this.AddSwitch("claire_reward");         // 0026
        this.AddSwitch("claire_fly");            // 0027
        this.AddSwitch("woof_sleep_1");          // 0028
        this.AddSwitch("woof_sleep_2");          // 0029
        this.AddSwitch("woof_sleep_3");          // 0030
        this.AddSwitch("aimottle_1");            // 0031
        this.AddSwitch("aimottle_2");            // 0032
        this.AddSwitch("viewed");                // 0033
        this.AddSwitch("claire_poster");         // 0034
        this.AddSwitch("stump");                 // 0035
        this.AddSwitch("caina_cafe");            // 0036
        this.AddSwitch("sign");                  // 0037
        this.AddSwitch("zera_athousescene");     // 0038
        this.AddSwitch("tree_letter");           // 0039
        this.AddSwitch("snek");                  // 0040

        this.AddSwitch("lighthouse");            // 0041
        this.AddSwitch("pier");                  // 0042
        this.AddSwitch("prince_1");              // 0043
        this.AddSwitch("prince_2");              // 0044
        this.AddSwitch("prince_3");              // 0045
        this.AddSwitch("prince_4");              // 0046
        this.AddSwitch("prince_index");          // 0047
        this.AddSwitch("tailor");                // 0048
        this.AddSwitch("tailor_dress");          // 0049
        this.AddSwitch("treasure");              // 0050
        this.AddSwitch("prince_parents_1");      // 0051
        this.AddSwitch("prince_parents_2");      // 0052
        this.AddSwitch("???");                   // 0053
        this.AddSwitch("caina_appeared");        // 0054
        this.AddSwitch("stump_touched");         // 0055
        this.AddSwitch("caina_sparred");         // 0056
        this.AddSwitch("j*b");                   // 0057
        this.AddSwitch("j*bbing");               // 0058
        this.AddSwitch("j*bbed");                // 0059
        this.AddSwitch("j*bbed_good");           // 0060

        this.AddSwitch("letter_house_1");        // 0061
        this.AddSwitch("letter_house_2");        // 0062
        this.AddSwitch("letter_house_3");        // 0063
        this.AddSwitch("letter_mail_1");         // 0064
        this.AddSwitch("letter_mail_2");         // 0065
        this.AddSwitch("letter_mail_3");         // 0066
        this.AddSwitch("traveller_village");     // 0067
        this.AddSwitch("kitty_fight");           // 0068
        this.AddSwitch("kitty_cat");             // 0069
        this.AddSwitch("kitty_bye");             // 0070
        this.AddSwitch("zera_manor");            // 0071
        this.AddSwitch("dragon_noticed");        // 0072
        this.AddSwitch("dragon_forest");         // 0073
        this.AddSwitch("dragon_deeper");         // 0074
        this.AddSwitch("dragon_transformed");    // 0075
        this.AddSwitch("dragon_done");           // 0076
        this.AddSwitch("dragon_talked");         // 0077
        this.AddSwitch("zera_drink");            // 0078
        this.AddSwitch("drink");                 // 0079
        this.AddSwitch("heroes_set");            // 0080

        this.AddSwitch("anotherland");           // 0081
        this.AddSwitch("adventure_start");       // 0082
        this.AddSwitch("heroes");                // 0083
        this.AddSwitch("claire_joins");          // 0084
        this.AddSwitch("claire_here");           // 0085
        this.AddSwitch("heroes_betrayel");       // 0086
        this.AddSwitch("heroes_fight");          // 0087
        this.AddSwitch("save");                  // 0088
        this.AddSwitch("adventure_nohotspring"); // 0089
        this.AddSwitch("adventure_armored");     // 0090
        this.AddSwitch("heroes_reunite");        // 0091
        this.AddSwitch("adventure_dizzy");       // 0092
        this.AddSwitch("adventure_creeps");      // 0093
        this.AddSwitch("adventure_done");        // 0094
        this.AddSwitch("heroes_rogue");          // 0095
        this.AddSwitch("este_warp");             // 0096
        this.AddSwitch("journal_a");             // 0097
        this.AddSwitch("journal_b");             // 0098
        this.AddSwitch("leftroom");              // 0099
        this.AddSwitch("journal_pages_1");       // 0100

        this.AddSwitch("journal_pages_2");       // 0101
        this.AddSwitch("journal_pages_3");       // 0102
        this.AddSwitch("journal_done");          // 0103
        this.AddSwitch("claire_concern");        // 0104
        this.AddSwitch("bird_form");             // 0105
        this.AddSwitch("tem_speach");            // 0106
        this.AddSwitch("tem_gone");              // 0107
        this.AddSwitch("woof_venture");          // 0108
        this.AddSwitch("soldier_overheard");     // 0109
        this.AddSwitch("librarian");             // 0110
        this.AddSwitch("blacksmith");            // 0111
        this.AddSwitch("captain");               // 0112
        this.AddSwitch("soldier_annoying");      // 0113
        this.AddSwitch("villager_1");            // 0114
        this.AddSwitch("villager_2");            // 0115
        this.AddSwitch("villager_3");            // 0116
        this.AddSwitch("villager_4");            // 0117
        this.AddSwitch("soldier_talk_1");        // 0118
        this.AddSwitch("sailor_1");              // 0119
        this.AddSwitch("sailor_2");              // 0120

        this.AddSwitch("sailor_3");              // 0121
        this.AddSwitch("sailor_4");              // 0122
        this.AddSwitch("soldier_talk_10");       // 0123
        this.AddSwitch("townsperson_1");         // 0124
        this.AddSwitch("townsperson_2");         // 0125
        this.AddSwitch("townsperson_3");         // 0126
        this.AddSwitch("townsperson_4");         // 0127
        this.AddSwitch("townsperson_5");         // 0128
        this.AddSwitch("townsperson_6");         // 0129
        this.AddSwitch("soldier_talk_11");       // 0130
        this.AddSwitch("soldier_talk_12");       // 0131
        this.AddSwitch("guard_1");               // 0132
        this.AddSwitch("maid_1");                // 0133
        this.AddSwitch("guard_2");               // 0134
        this.AddSwitch("highknight");            // 0135
        this.AddSwitch("sacredknight");          // 0136
        this.AddSwitch("guard_3");               // 0137
        this.AddSwitch("guard_4");               // 0138
        this.AddSwitch("guard_5");               // 0139
        this.AddSwitch("guard_6");               // 0140

        this.AddSwitch("guard_7");               // 0141
        this.AddSwitch("butler_1");              // 0142
        this.AddSwitch("maid_2");                // 0143
        this.AddSwitch("chef");                  // 0144
        this.AddSwitch("butler_2");              // 0145
        this.AddSwitch("soldier_reluctance");    // 0146
        this.AddSwitch("soldier_talk_20");       // 0147
        this.AddSwitch("soldier_talk_21");       // 0148
        this.AddSwitch("soldier_talk_22");       // 0149
        this.AddSwitch("zera_crystal");          // 0150
        this.AddSwitch("fbuttler_1");            // 0151
        this.AddSwitch("fbuttler_2");            // 0152
        this.AddSwitch("fmaid_3");               // 0153
        this.AddSwitch("fbuttler_castle");       // 0154
        this.AddSwitch("fbuttler_kitchen");      // 0155
        this.AddSwitch("fbuttler_4");            // 0156
        this.AddSwitch("fmaid_4");               // 0157
        this.AddSwitch("fbuttler_5");            // 0158
        this.AddSwitch("frog");                  // 0159
        this.AddSwitch("forestsoldier_1");       // 0160

        this.AddSwitch("forestsoldier_2");       // 0161
        this.AddSwitch("zera_bonus");            // 0162
        this.AddSwitch("claire_journal");        // 0163
        this.AddSwitch("chest");                 // 0164
        this.AddSwitch("butterfly");             // 0165
        this.AddSwitch("aimottle_nigerundayo");  // 0166

        // #endregion

        
        // #region ----------------------------------------- ORIGINALLY SELF SWITCHES

        this.AddSwitch("mole");
        this.AddSwitch("shackghost");

        // #endregion


        // #region ----------------------------------------- VARIABLES

        this.AddVariable("harp");                // 0001
        this.AddVariable("traveller_lost");      // 0002
        this.AddVariable("zera_manor");          // 0003
        this.AddVariable("illusts");             // 0004
        this.AddVariable("hors");                // 0005
        this.AddVariable("carriage_addiction");  // 0006
        this.AddVariable("claire_go");           // 0007
        this.AddVariable("zera_athouse");        // 0008
        this.AddVariable("zera_talkcount");      // 0009
        this.AddVariable("letters_delivered");   // 0010
        this.AddVariable("hellbed");             // 0011
        this.AddVariable("her");                 // 0012
        this.AddVariable("tem_jump");            // 0013

        // #endregion
    }

    static async Run (id)
    {
        switch (id)
        {
            // #region ------------------------------------- special
            case "hintbird": {
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

                this.dialogueBox.Close();
            } break;

            case "fly": {
                Loader.Ready(4);
                
                const them = RPGMovement.FindChar("claireyokifly");
                them.lockLook = true;
                them.moveSpeed = 6;
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                them.moveSpeed = 4;
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                await them.MoveTowards(Vector2.left);
                them.moveSpeed = 2;
                await them.MoveTowards(Vector2.right);
                them.lockLook = false;

                AudioManager.instance.PlayBGM("fly", 0.25);
                await this.Timer(60);

                this.dialogueBox.SetFace("claire", "happy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "meditative");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();

                await this.Timer(30);
                them.LookAt(Vector2.left);
                await this.Timer(100);
                them.LookAt(Vector2.up);
                await this.Timer(20);
                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("claire", "down");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.right);

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("claire", "down");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                this.dialogueBox.Close();

                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[11]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[12]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.left);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[13]);
                this.dialogueBox.SetFace("claire", "happy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[14]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[15]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[16]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[17]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.right);

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[18]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[19]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[20]);
                this.dialogueBox.SetFace("claire", "sigh");
                await this.dialogueBox.Type(LocaleManager.Find(id)[21]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[22]);
                this.dialogueBox.SetFace("yoki", "meditative");
                await this.dialogueBox.Type(LocaleManager.Find(id)[23]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[24]);
                this.dialogueBox.SetFace("claire", "sigh");
                await this.dialogueBox.Type(LocaleManager.Find(id)[25]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[26]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[27]);
                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[28]);
                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[29]);
                this.dialogueBox.SetFace("claire", "sigh");
                await this.dialogueBox.Type(LocaleManager.Find(id)[30]);
                this.dialogueBox.Close();

                await this.Timer(60);
                them.LookAt(Vector2.left);
                await this.Timer(80);
                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[31]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[32]);
                this.dialogueBox.SetFace("claire", "happy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[33]);
                this.dialogueBox.Close();

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[34]);
                this.dialogueBox.SetFace("claire", "down");
                await this.dialogueBox.Type(LocaleManager.Find(id)[35]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.right);

                this.dialogueBox.SetFace("yoki", "meditative");
                await this.dialogueBox.Type(LocaleManager.Find(id)[36]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[37]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("yoki", "disheartened");
                await this.dialogueBox.Type(LocaleManager.Find(id)[38]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.left);

                this.dialogueBox.SetFace("claire", "sigh");
                await this.dialogueBox.Type(LocaleManager.Find(id)[39]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[40]);
                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[41]);
                this.dialogueBox.SetFace("claire", "happy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[42]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.right);

                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[43]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("yoki", "disheartened");
                await this.dialogueBox.Type(LocaleManager.Find(id)[44]);
                this.dialogueBox.SetFace("claire", "sad");
                await this.dialogueBox.Type(LocaleManager.Find(id)[45]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.up);

                await this.Timer(80);
                this.dialogueBox.SetFace("claire", "happy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[46]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.down);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[47]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.left);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[48]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[49]);
                this.dialogueBox.Close();

                them.LookAt(Vector2.down);

                AudioManager.instance.FadeOutBGM(5);
                await this.Timer(60);

                (async () => {
                    them.animateWalk = true;
                    them.lockLook = true;
                    them.moveSpeed = 3;
                    await them.MoveTowards(Vector2.right);
                    them.moveSpeed = 4;
                    await them.MoveTowards(Vector2.left);
                    them.moveSpeed = 6;
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    await them.MoveTowards(Vector2.left);
                    them.gameObject.SetActive(false);
                })();

                await this.Timer(70);
                this.TintAll(new Color(
                    -85 / 255,
                    -85 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(12);
                this.TintAll(new Color(
                    -153 / 255,
                    -153 / 255,
                    -170 / 255,
                    0
                ));
                await this.Timer(12);

                this.SetSwitch("claire_fly", true);

                Player.instance.LookAt(Vector2.up);
                const transfer = new MapTransfer();
                transfer.pos = new Vector2(5, -4);
                MapTransfer.last = transfer;
                await this.BlackSwitch(4);

                await this.Timer(60);
                Transitioner.instance.Clear();
                this.TintAll(new Color(
                    -153 / 255,
                    -153 / 255,
                    -170 / 255,
                    0
                ));
                await this.Timer(12);
                this.TintAll(new Color(
                    -85 / 255,
                    -85 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(12);
                this.TintAll(Color.clear);

                this.dialogueBox.SetFace("claire", "happy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[50]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[51]);
                this.dialogueBox.Close();

                Player.instance.LookAt(Vector2.down);
                this.AddToVariable("illusts");
                AudioManager.instance.PlayBGM("forest", 0.2);
            } break;

            case "carriage_right": {
                AudioManager.instance.PlayBGM("title", 0.2);
                Player.instance.GetComponent(SpriteRenderer).color.a = 0;
                this.TintAll(new Color(-1, -1, -1, 0));
                Transitioner.instance.Clear();

                await this.illustrator.Set(0, "carriage_right", 50 / 255, new Vector2(0, 40 / 96));
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.TintAll(new Color(
                    -80 / 255,
                    -80 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -40 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                while (true)
                {
                    let breakLoop = false;

                    for (let i = 0; i < 15; i++)
                    {
                        await this.Timer(2);
                        if (InputManager.IsPressed("ok"))
                        {
                            breakLoop = true;
                            break;
                        }
                    }

                    if (breakLoop) break;

                    await this.illustrator.Move(0, 1, new Vector2(0, 37 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 42 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 37 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 42 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 38 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 41 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 40 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                }

                AudioManager.instance.FadeOutBGM(2);

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                this.illustrator.Clear(0);

                Player.instance.LookAt(Vector2.right);
                const transfer = new MapTransfer();
                transfer.pos = new Vector2(-6, -5);
                MapTransfer.last = transfer;
                await this.BlackSwitch(27);

                await this.Timer(40);
                await this.TintAll(new Color(
                    -80 / 255,
                    -80 / 255,
                    -100 / 255,
                    0
                ));
                Transitioner.instance.Clear();
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -40 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                await this.dialogueBox.Type(LocaleManager.Find("carriage"));
                this.dialogueBox.Close();

                AudioManager.instance.PlayBGM("forest", 0.2);

                if (!this.GetSwitch("carriage"))
                {
                    this.SetSwitch("carriage", true);
                    this.AddToVariable("illusts");
                }
            } break;
            case "carriage_left": {
                AudioManager.instance.PlayBGM("title", 0.2);
                Player.instance.GetComponent(SpriteRenderer).color.a = 0;
                this.TintAll(new Color(-1, -1, -1, 0));
                Transitioner.instance.Clear();

                await this.illustrator.Set(0, "carriage_left", 50 / 255, new Vector2(0, 40 / 96));
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.TintAll(new Color(
                    -80 / 255,
                    -80 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -40 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                while (true)
                {
                    let breakLoop = false;

                    for (let i = 0; i < 15; i++)
                    {
                        await this.Timer(2);
                        if (InputManager.IsPressed("ok"))
                        {
                            breakLoop = true;
                            break;
                        }
                    }

                    if (breakLoop) break;

                    await this.illustrator.Move(0, 1, new Vector2(0, 37 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 42 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 37 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 42 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 38 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 41 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                    await this.illustrator.Move(0, 1, new Vector2(0, 40 / 96), null, 4);
                    if (InputManager.IsPressed("ok")) break;
                }

                AudioManager.instance.FadeOutBGM(2);

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                this.illustrator.Clear(0);

                Player.instance.LookAt(Vector2.left);
                const transfer = new MapTransfer();
                transfer.pos = new Vector2(5, 1);
                MapTransfer.last = transfer;
                await this.BlackSwitch(15);

                await this.Timer(40);
                await this.TintAll(new Color(
                    -80 / 255,
                    -80 / 255,
                    -100 / 255,
                    0
                ));
                Transitioner.instance.Clear();
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -40 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                await this.dialogueBox.Type(LocaleManager.Find("carriage"));
                this.dialogueBox.Close();

                AudioManager.instance.PlayBGM("village", 0.2);

                if (!this.GetSwitch("carriage"))
                {
                    this.SetSwitch("carriage", true);
                    this.AddToVariable("illusts");
                }
            } break;
            // #endregions


            // #region ------------------------------------- common signs
            case "villagepath_sign2":
            case "townpath_sign3":
            case "lake_sign":
            case "castleroad_sign1":
            case "castleroad_sign2":
            case "castletowngate_sign":
            case "castletownwest_tailorssign":
            case "castletownwest_innsign":
            case "castletownwest_librarysign":
            case "castletowneast_doctorsign":
            case "castletowneast_blacksmithsign":
                if (!Player.instance.lookingAt.Equals(Vector2.up))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_back`));
                }
                else await this.dialogueBox.Type(LocaleManager.Find(id));

                this.dialogueBox.Close();
                break;
            // #endregion

            // #region ------------------------------------- common saves
            case "forestpath_save":
            case "village_save":
            case "graveyard_save":
            case "castletowngate_save": {
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2], true);

                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_choices`)[0],
                    LocaleManager.Find(`${id}_choices`)[1]
                ], 1);

                await this.dialogueBox.Close();

                if (choice === 0)
                {
                    SaveScreen.Show();
                    return true;
                }
            } break;
            // #endregion


            // #region ------------------------------------- yokihouse
            case "yolkhouse_mail":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "yolkhouse_veggie":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "yolkhouse_well":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "yolkhouse_zera":
                RPGMovement.FindChar("zera").LookAtPlayer();

                if (this.GetSwitch("zera_athousescene"))
                {
                    this.dialogueBox.SetFace("yoki", "annoyed");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_leave`)[0]);
                    this.dialogueBox.SetFace("zera", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_leave`)[1]);
                    this.dialogueBox.SetFace("yoki", "annoyed");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_leave`)[2]);
                    this.dialogueBox.Close();

                    return;
                }

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "zera_talk_1", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);
                
                this.dialogueBox.SetFace("yoki", "upset");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);

                await this.illustrator.Set(1, "zera_talk_2", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                this.illustrator.Clear(0);
                await this.Timer(20);

                this.dialogueBox.SetFace("zera", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);

                await this.illustrator.Set(0, "zera_talk_3", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                this.illustrator.Clear(1);
                await this.Timer(20);

                this.dialogueBox.SetFace("zera", "pout");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);

                await this.illustrator.Set(1, "zera_talk_2", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                this.illustrator.Clear(0);
                await this.Timer(20);

                this.dialogueBox.SetFace("zera", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);

                await this.illustrator.Set(0, "zera_talk_3", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                this.illustrator.Clear(1);
                await this.Timer(20);

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

                await this.illustrator.Set(1, "zera_talk_2", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                this.illustrator.Clear(0);
                await this.Timer(20);

                this.dialogueBox.SetFace("zera", "pout");
                await this.dialogueBox.Type(LocaleManager.Find(id)[17]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[18]);

                await this.illustrator.Set(0, "zera_talk_3", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                this.illustrator.Clear(1);
                await this.Timer(20);

                this.dialogueBox.SetFace("zera", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[19]);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(20);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                this.SetSwitch("zera_athousescene", true);
                this.AddToVariable("zera_talkcount");
                this.AddToVariable("illusts");
                break;
            case "yolkhouse_harp": {
                const harp = RPGMovement.FindChar("harp");
                const randMove = harp.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                harp.LookAtPlayer();

                if (this.GetSwitch("harp"))
                {
                    this.dialogueBox.SetFace("harp", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_met`)[0]);
                    this.dialogueBox.SetFace("harp", "excited");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_met`)[1]);
                    this.dialogueBox.SetFace("yoki", "annoyed");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_met`)[2]);
                    this.dialogueBox.SetFace("harp", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_met`)[3]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_met`)[4]);
                }
                else
                {
                    this.dialogueBox.SetFace("harp", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    this.dialogueBox.SetFace("harp", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("harp", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    this.dialogueBox.SetFace("harp", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                    this.dialogueBox.SetFace("harp", "excited");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                    this.dialogueBox.SetFace("yoki", "annoyed");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                    this.dialogueBox.SetFace("harp", "excited");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                    this.dialogueBox.SetFace("harp", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                    this.dialogueBox.SetFace("yoki", "surprised");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                }

                this.dialogueBox.Close();

                this.SetSwitch("harp", true);

                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "yolkhouse_harp_set":
                this.SetVariable("harp", Math.RandomInt(1, 5));
                break;
            case "yolkhouse_claire": {
                const claire = RPGMovement.FindChar("claire");
                claire.LookAtPlayer();

                if (this.GetSwitch("journal_done"))
                {
                    this.dialogueBox.SetFace("claire", "sad");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_concern`)[0]);
                    this.dialogueBox.SetFace("claire", "sad");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_concern`)[1]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_concern`)[2]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_concern`)[3]);
                    this.dialogueBox.SetFace("claire", "sad");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_concern`)[4]);
                    this.dialogueBox.Close();

                    this.SetSwitch("claire_concern", true);
                    return;
                }

                if (!this.GetSwitch("claire_reward")) return;

                if (this.GetSwitch("claire_fly"))
                {
                    this.dialogueBox.SetFace("claire", "happy");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_flew`)[0]);
                    this.dialogueBox.SetFace("yoki", "smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_flew`)[1]);
                    this.dialogueBox.Close();
                    return;
                }

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_fly`)[0]);
                this.dialogueBox.SetFace("yoki", "meditative");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_fly`)[1], true);

                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_fly_choices`)[0],
                    LocaleManager.Find(`${id}_fly_choices`)[1]
                ], 1);

                if (choice === 1)
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_fly_no`)[0]);
                    this.dialogueBox.SetFace("claire", "sigh");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_fly_no`)[1]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_fly_no`)[2]);
                    this.dialogueBox.Close();
                    return;
                }

                Loader.Ready(23);

                this.dialogueBox.SetFace("claire", "happy");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_fly_ok`)[0]);
                this.dialogueBox.SetFace("yoki", "sweatdrop");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_fly_ok`)[1]);
                this.dialogueBox.Close();

                AudioManager.instance.FadeOutBGM(1);

                this.TintAll(new Color(
                    -85 / 255,
                    -85 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(12);
                this.TintAll(new Color(
                    -153 / 255,
                    -153 / 255,
                    -170 / 255,
                    0
                ));
                await this.Timer(12);

                const transfer = new MapTransfer();
                transfer.pos = new Vector2(0, 0);
                MapTransfer.last = transfer;
                await this.BlackSwitch(23);

                Player.instance.GetComponent(SpriteRenderer).color.a = 0;

                await this.Timer(60);
                this.TintAll(new Color(
                    -153 / 255,
                    -153 / 255,
                    -170 / 255,
                    0
                ));
                Transitioner.instance.Clear();
                await this.Timer(12);
                this.TintAll(new Color(
                    -85 / 255,
                    -85 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(12);
                this.TintAll(Color.clear);

                await this.Run("fly");
            } break;
            // #endregion

            // #region ------------------------------------- forest_view
            case "forestview_view":
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));
                await this.Timer(40);

                await this.illustrator.Set(0, "forest_view", 50 / 255, new Vector2(0, 3));
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(30);
                await this.illustrator.Move(0, null, Vector2.zero, null, 160);

                await this.WaitOk();

                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(60);

                this.TintAll(new Color(
                    -153 / 255,
                    -153 / 255,
                    -170 / 255,
                    0
                ));
                await this.Timer(12);
                this.TintAll(new Color(
                    -85 / 255,
                    -85 / 255,
                    -103 / 255,
                    0
                ));
                await this.Timer(12);
                this.TintAll(Color.clear);

                if (!this.GetSwitch("viewed"))
                {
                    this.SetSwitch("viewed", true);
                    this.AddToVariable("illusts");
                }
                break;
            case "forestview_este": {
                RPGMovement.FindChar("este").LookAtPlayer();

                if (this.GetSwitch("este_warp"))
                {
                    this.dialogueBox.SetFace("este", null);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_warped`), true);
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("este", null);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    this.dialogueBox.SetFace("este", null);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3], true);
                }

                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_choices`)[0],
                    LocaleManager.Find(`${id}_choices`)[1]
                ], 1);

                this.dialogueBox.SetFace("yoki", "smile");

                if (choice === 1)
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_no`));
                    this.dialogueBox.Close();

                    this.SetSwitch("este_warp", true);
                    return;
                }

                Loader.Ready(12);

                await this.dialogueBox.Type(LocaleManager.Find(`${id}_ok`));
                this.dialogueBox.Close();

                AudioManager.instance.FadeOutBGM(1);

                this.TintAll(new Color(
                    -68 / 255,
                    -68 / 255,
                    -68 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -102 / 255,
                    -102 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -187 / 255,
                    -187 / 255,
                    -187 / 255,
                    0
                ));
                await this.Timer(8);

                Player.instance.LookAt(Vector2.down);
                const transfer = new MapTransfer();
                transfer.pos = new Vector2(-5, 32);
                MapTransfer.last = transfer;
                await this.BlackSwitch(12);

                await this.Timer(40);
                await this.TintAll(new Color(
                    -187 / 255,
                    -187 / 255,
                    -187 / 255,
                    0
                ));
                Transitioner.instance.Clear();
                await this.Timer(8);
                await this.TintAll(new Color(
                    -102 / 255,
                    -102 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(8);
                this.TintAll(new Color(
                    -68 / 255,
                    -68 / 255,
                    -68 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);
                await this.Timer(8);

                AudioManager.instance.PlayBGM("village", 0.2);

                this.SetSwitch("este_warp", true);
            } break;
            // #endregion

            // #region ------------------------------------- forest_barrier
            case "aimottle_mail":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrier_fox1": {
                const fox = RPGMovement.FindChar("fox1");              
                fox.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
            } break;
            case "forestbarrier_fox2":
                RPGMovement.FindChar("fox2").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrier_squirrel1": {
                const squirrel = RPGMovement.FindChar("squirrel1");
                const randMove = squirrel.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                squirrel.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "forestbarrier_squirrel2":
                RPGMovement.FindChar("squirrel2").LookAtPlayer();

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrier_squirrel3": {
                const squirrel = RPGMovement.FindChar("squirrel3");
                const randMove = squirrel.GetComponent(RandomMove, true);

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
                squirrel.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "forestbarrier_deer": {
                const deer = RPGMovement.FindChar("deer");
                
                deer.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
                } break;
            case "forestbarrier_bird":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrier_blockerfly":
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrier_sbutterfly":
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(9);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "flower_ring", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(40);
 
                GameObject.Find("char_sbutterfly").SetActive(false);
                await this.WaitOk();

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(20);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();

                this.SetSwitch("butterfly", true);
                this.AddToVariable("illusts");
                break;
            case "forestbarrier_dragon": {
                if (this.GetSwitch("dragon_deeper")) return;

                AudioManager.instance.FadeOutBGM(3);

                await this.Timer(30);
                CamCtrl.current.Scroll(new Vector2(7 + 9 - Player.instance.gridPos.x, 0), 4);
                await this.Timer(140);

                const dragon = RPGMovement.FindChar("dragon");
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                dragon.gameObject.SetActive(false);

                await this.Timer(30);
                CamCtrl.current.Scroll(new Vector2(-(7 + 9 - Player.instance.gridPos.x), 0), 4);
                await this.Timer(140);

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();

                AudioManager.instance.PlayBGM("forest", 0.2);
                this.SetSwitch("dragon_deeper", true);
            } break;
            // #endregion

            // #region ------------------------------------- forest_barrier_edge
            case "forestbarrieredge_raccoon1":
                RPGMovement.FindChar("raccoon1").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrieredge_raccoon2": {
                const raccoon = RPGMovement.FindChar("raccoon2");

                raccoon.LookAt(Vector2.up);
                await this.Timer(2);
                raccoon.LookAt(Vector2.right);
                await this.Timer(2);
                raccoon.LookAt(Vector2.down);
                await this.Timer(2);
                raccoon.LookAt(Vector2.left);
                await this.Timer(2);
                raccoon.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await raccoon.Jump();
            } break;
            case "forestbarrieredge_raccoon3":
                RPGMovement.FindChar("raccoon3").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrieredge_boar": {
                AudioManager.instance.PlaySE("crush_1", 0.6);

                const boar = RPGMovement.FindChar("boar");
                boar.LookAtPlayer();
                boar.Jump();

                Player.instance.lockLook = true;
                Player.instance.moveSpeed = 4;
                await Player.instance.StepBack();
                Player.instance.lockLook = false;

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
            } break;
            case "forestbarrieredge_fox": {
                const fox = RPGMovement.FindChar("fox");
                const randMove = fox.GetComponent(RandomMove, true);

                randMove.enabled = false;
                fox.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();

                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "forestbarrieredge_bird":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrieredge_squirrel": {
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);

                const squirrel = RPGMovement.FindChar("squirrel");
                const randMove = squirrel.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                squirrel.LookAtPlayer();

                await squirrel.Jump();
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "forestbarrieredge_rabbit":
                RPGMovement.FindChar("rabbit").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrieredge_tigertaur": {
                Resources.Load("audio/bgm/yokihouse");

                const tigertaur = RPGMovement.FindChar("tigertaur");
                tigertaur.LookAtPlayer();
                tigertaur.lockLook = true;

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "tigertaur_1", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("tigertaur", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "think");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                AudioManager.instance.FadeOutBGM(1);

                this.dialogueBox.SetFace("tigertaur", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("tigertaur", "grin");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                await this.illustrator.Set(0, "tigertaur_2", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("tigertaur", "grin");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("yoki", "sweatdrop");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.SetFace("tigertaur", "grin");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                await this.illustrator.Set(0, "tigertaur_3", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("tigertaur", "grin");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);

                await this.illustrator.Set(1, "tigertaur_4", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                await this.Timer(20);
                this.illustrator.Clear(0);
                
                this.dialogueBox.SetFace("yoki", "sweatdrop");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);

                tigertaur.GetComponent("SpriteLibrary").asset = Resources.Find("spritelibs/chars/catiger");
                this.SetSwitch("kitty_fight", true);

                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(1);
                await this.Timer(40);

                Player.instance.LookAt(Vector2.down);
                tigertaur.GetComponent(SpriteRenderer).color.a = 0;

                this.dialogueBox.SetFace("claire", "down");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.SetFace("yoki", "think");
                await this.dialogueBox.Type(LocaleManager.Find(id)[11]);
                this.dialogueBox.Close();

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);
                await this.Timer(20);

                AudioManager.instance.PlayBGM("yokihouse", 0.2);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[12]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[13]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[14]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[15]);
                this.dialogueBox.Close();

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "tigertaur_5", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[16]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[17]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[18]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[19]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[20]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[21]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[22]);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                await this.illustrator.Set(0, "tigertaur_6", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[23]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[24]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[25]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[26]);

                tigertaur.GetComponent(SpriteRenderer).color.a = 1;
                this.SetSwitch("kitty_bye", true);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);
                await this.Timer(40);

                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[27]);
                this.dialogueBox.SetFace("claire", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[28]);
                this.dialogueBox.Close();

                const claire = RPGMovement.FindChar("claire");
                claire.moveSpeed = 4;
                await claire.MoveTowards(Vector2.up);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);
                await claire.MoveTowards(Vector2.left);

                AudioManager.instance.FadeOutBGM(1);

                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[29]);
                this.dialogueBox.Close();

                AudioManager.instance.PlayBGM("forest", 0.2);

                this.AddToVariable("illusts");
                this.SetSwitch("kitty_cat", true);
            } break;
            case "forestbarrieredge_catiger":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "forestbarrieredge_traveller": {
                if (this.GetSwitch("traveller_done")) return;

                Party.Clear(1);
                await this.WaitTransfer();

                Player.instance.avoidInputs = true;
                this.SetSwitch("traveller_help", false);
                this.SetSwitch("traveller", true);

                if (this.GetVariable("traveller_lost") >= 1)
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[1]);
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[1]);
                }

                this.dialogueBox.Close();

                this.AddToVariable("traveller_lost");
                Player.instance.avoidInputs = false;
            } break;
            // #endregion

            // #region ------------------------------------- cliffs
            case "cliffs_deer1": {
                const deer = RPGMovement.FindChar("deer1");
                await deer.LookAt(Vector2.left);
                await this.Timer(2);
                await deer.LookAt(Vector2.up);
                await this.Timer(2);
                await deer.LookAt(Vector2.right);
                await this.Timer(2);
                await deer.LookAt(Vector2.down);
                await this.Timer(2);
                await deer.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
            } break;
            case "cliffs_deer2": 
                RPGMovement.FindChar("deer2").LookAtPlayer();

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "cliffs_deer3": 
                RPGMovement.FindChar("deer3").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "cliffs_boar":
                RPGMovement.FindChar("boar").LookAwayPlayer();
                break;
            case "cliffs_fox":
                RPGMovement.FindChar("fox").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "cliffs_rabbit1": {
                const rabbit = RPGMovement.FindChar("rabbit1");
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
            } break;
            case "cliffs_rabbit2": {
                const rabbit = RPGMovement.FindChar("rabbit2");
                rabbit.charCollision = false;
                rabbit.moveSpeed = 6;
                await rabbit.MoveTowards(Vector2.left);
                await rabbit.MoveTowards(Vector2.left);
                await rabbit.MoveTowards(Vector2.left);
                await rabbit.MoveTowards(Vector2.right);
                await rabbit.MoveTowards(Vector2.right);
                await rabbit.MoveTowards(Vector2.right);
                rabbit.charCollision = true;
                rabbit.LookAtPlayer();
            } break;
            case "cliffs_bird":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "cliffs_squirrel": {
                const squirrel = RPGMovement.FindChar("squirrel");

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                squirrel.LookAtPlayer();
                await squirrel.Jump();
            } break;
            case "cliffs_raccoon":
                RPGMovement.FindChar("raccoon").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "cliffs_frog":
                RPGMovement.FindChar("frog").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "cliffs_wolf":
                RPGMovement.FindChar("wolf").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "cliffs_woof": {
                if (this.GetSwitch("woof_sleep_3"))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_4`)[0]);
                    this.dialogueBox.SetFace("woof", "sleep");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_4`)[1]);
                    this.dialogueBox.Close();
                    return;
                }
                else if (this.GetSwitch("woof_sleep_2"))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_3`)[0]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_3`)[1]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_3`)[2]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_3`)[3]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_3`)[4]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_3`)[5]);
                    this.dialogueBox.Close();

                    this.SetSwitch("woof_sleep_3", true);
                    return;
                }
                else if (this.GetSwitch("woof_sleep_1"))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[0]);
                    this.dialogueBox.SetFace("yoki", "annoyed");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[1]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[2]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[3]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[4]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[5]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[6]);
                    this.dialogueBox.Close();

                    this.SetSwitch("woof_sleep_2", true);
                    return;
                }

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "woof_1", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("woof", "sleep");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[0]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[1]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[2]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[3]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[4]);
                this.dialogueBox.SetFace("woof", "sleep");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[5]);

                await this.illustrator.Set(1, "woof_2", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                await this.Timer(20);
                this.illustrator.Clear(0);

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[6]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[7]);

                await this.illustrator.Set(0, "woof_3", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);
                this.illustrator.Clear(1);

                this.dialogueBox.SetFace("woof", "sleep");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[8]);
                this.dialogueBox.SetFace("woof", "sleep");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[9]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[10]);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(20);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                this.SetSwitch("woof_sleep_1", true);
                this.AddToVariable("illusts")
            } break;
            case "cliffs_bonus_zera":
                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("zera", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "cliffs_bonus_aimottle": {
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "extra_1", 50 / 100);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(30);

                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);

                await this.illustrator.Set(1, "extra_2", 50 / 100);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                await this.Timer(20);
                this.illustrator.Clear(0);

                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                this.dialogueBox.SetFace("aimottle", "angry");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                this.dialogueBox.SetFace("aimottle", "angry");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[11]);
                this.dialogueBox.SetFace("aimottle", "angry");
                await this.dialogueBox.Type(LocaleManager.Find(id)[12]);

                await this.illustrator.Set(0, "blank", 1);
                this.illustrator.Clear(1)
                await this.Timer(2);
                await this.illustrator.Tint(0, new Color(-1, -1, -1, 0));
                await this.illustrator.Tint(0, Color.clear);

                AudioManager.instance.PlaySE("explosive_whish", 0.7);

                await this.Timer(3);
                await this.illustrator.Set(1, "extra_3", 1, new Vector2(-4 / 96, 0), new Vector2(1.02, 1.02));
                this.illustrator.Clear(0);
                await this.Timer(3);
                await this.illustrator.Move(1, null, Vector2.zero, Vector2.one);
                await this.illustrator.Set(0, "extra_3", 1);
                await this.illustrator.Move(0, 0, new Vector2(-1.25, 100 / 96), new Vector2(1.5, 1.5), 10);
                this.illustrator.Clear(0);

                this.dialogueBox.SetFace("woof", "knocked out");
                await this.dialogueBox.Type(LocaleManager.Find(id)[13]);
                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[14]);
                
                await this.illustrator.Set(0, "extra_4", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);
                this.illustrator.Clear(1);

                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[15]);
                this.dialogueBox.SetFace("aimottle", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[16]);

                GameObject.Find("char_aimottle").SetActive(false);

                Player.instance.LookAt(Vector2.up);
                Player.instance.animateIdle = false;

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(20);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);
                await this.Timer(60);

                AudioManager.instance.PlaySE("jump", 0.9, 1.3);
                await Player.instance.Jump();
                Player.instance.animateIdle = true;

                await this.Timer(60);
                Player.instance.LookAt(Vector2.left);
                await this.Timer(30);
                Player.instance.LookAt(Vector2.right);
                await this.Timer(30);
                Player.instance.LookAt(Vector2.left);
                await this.Timer(30);
                Player.instance.LookAt(Vector2.right);
                await this.Timer(60);
                Player.instance.LookAt(Vector2.down);

                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[17]);
                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[18]);
                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[19]);
                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[20]);
                this.dialogueBox.Close();

                this.SetSwitch("aimottle_nigerundayo", true);
            } break;
            case "cliffs_bonus_zera_bye":
                this.SetSwitch("zera_bonus", true);
                break;
            // #endregion

            // #region ------------------------------------- forest_tree
            case "foresttree_tree":
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "tree", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                if (this.GetSwitch("tree_letter"))
                {
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_seen`));

                    await this.illustrator.Move(0, 100 / 255);
                    await this.Timer(8);
                    await this.illustrator.Move(0, 50 / 255);
                    await this.Timer(8);
                    this.illustrator.Clear(0);
                    await this.Timer(20);

                    await this.TintAll(new Color(
                        -80 / 255,
                        -100 / 255,
                        -100 / 255,
                        0
                    ));
                    await this.Timer(8);
                    await this.TintAll(new Color(
                        -40 / 255,
                        -50 / 255,
                        -50 / 255,
                        0
                    ));
                    await this.Timer(8);
                    await this.TintAll(Color.clear);

                    return;
                }

                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                await this.illustrator.Set(1, "tree_noletter", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                await this.Timer(20);
                this.illustrator.Clear(0);

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);

                await this.illustrator.Set(0, "tree", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);
                this.illustrator.Clear(1);

                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(20);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                this.SetSwitch("tree_letter", true);
                this.AddToVariable("illusts");
                break;
            case "foresttree_bonus":
                await this.WaitTransfer();

                Player.instance.avoidInputs = true;

                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                await this.Timer(60);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await Player.instance.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await Player.instance.Jump();

                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.Close();

                await this.Timer(30);
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await Player.instance.Jump();
                await this.Timer(20);
                Player.instance.moveSpeed = 6;
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.left);
                await Player.instance.MoveTowards(Vector2.left);
                await Player.instance.MoveTowards(Vector2.left);
                await Player.instance.MoveTowards(Vector2.left);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.left);
                await Player.instance.MoveTowards(Vector2.left);
                await Player.instance.MoveTowards(Vector2.left);
                Player.instance.LookAt(Vector2.down);
                await this.Timer(30);

                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.Close();

                await Player.instance.MoveTowards(Vector2.left);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                Player.instance.LookAt(Vector2.up);

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "tree", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);

                await this.illustrator.Set(1, "tree_noletter", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                await this.Timer(20);
                this.illustrator.Clear(0);

                this.dialogueBox.SetFace("woof", "awake");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);

                await this.illustrator.Set(0, "woof_end_1", 50 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 1);
                await this.Timer(40);
                this.illustrator.Clear(1);

                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);

                await this.illustrator.Set(1, "blank", 50 / 255);
                await this.Timer(10);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(10);
                await this.illustrator.Move(1, 150 / 255);
                await this.Timer(10);
                await this.illustrator.Move(1, 200 / 255);
                await this.Timer(10);
                await this.illustrator.Move(1, 1);
                await this.Timer(10);
                this.illustrator.Clear(0);

                AudioManager.instance.FadeOutBGM(1);

                this.dialogueBox.SetFace("woof", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);

                await this.illustrator.Set(0, "woof_end_2", 50 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(10);
                await this.illustrator.Move(0, 1);
                await this.Timer(40);
                this.illustrator.Clear(1);

                this.dialogueBox.SetBG(1);
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                
                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(12);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(12);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(12);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(12);
                this.illustrator.Clear(0);
                await this.Timer(60);

                // ==================================================================== UNFINISHED
                
                Loader.Ready(12); // move to start of event

                await Party.Set(0, "bird");
                Player.instance.moveSpeed = 4;
                Player.instance.animateIdle = false;

                Player.instance.LookAt(Vector2.down);
                const transfer = new MapTransfer();
                transfer.pos = new Vector2(-5, 32); // set to bonus room
                MapTransfer.last = transfer;
                await this.BlackSwitch(12);

                await this.TintAll(new Color(
                    -187 / 255,
                    -187 / 255,
                    -187 / 255,
                    0
                ));
                Transitioner.instance.Clear();
                await this.Timer(10);
                await this.TintAll(new Color(
                    -136 / 255,
                    -136 / 255,
                    -136 / 255,
                    0
                ));
                await this.Timer(10);
                await this.TintAll(new Color(
                    -51 / 255,
                    -51 / 255,
                    -51 / 255,
                    0
                ));
                await this.Timer(10);
                await this.TintAll(Color.clear);

                this.SetSwitch("woof_venture", true);
                break;
            // #endregion
            
            // #region ------------------------------------- forest_mid
            case "forestmid_rabbit1":
                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }

                RPGMovement.FindChar("rabbit1").LookAwayPlayer();
                break;
            case "forestmid_rabbit2": {
                const rabbit = RPGMovement.FindChar("rabbit2");
                rabbit.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestmid_fox": {
                const fox = RPGMovement.FindChar("fox");
                fox.LookAtPlayer();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();

                    return;
                }

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
            } break;
            case "forestmid_bird": {
                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);

                const bird = RPGMovement.FindChar("bird");
                bird.LookAtPlayer();
                await bird.Jump();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();

                bird.LookAt(Vector2.left);
                await this.Timer(2);
                bird.LookAt(Vector2.up);
                await this.Timer(2);
                bird.LookAt(Vector2.right);
                await this.Timer(2);
                bird.LookAt(Vector2.down);
                await this.Timer(2);
                bird.LookAt(Vector2.left);
                await this.Timer(2);
                bird.LookAt(Vector2.up);
                await this.Timer(2);
                bird.LookAt(Vector2.right);
                await this.Timer(2);
                bird.LookAt(Vector2.down);
            } break;
            case "forestmid_raccoon1":
                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }

                RPGMovement.FindChar("raccoon1").LookAwayPlayer();
                break;
            case "forestmid_raccoon2":
                RPGMovement.FindChar("raccoon2").LookAwayPlayer();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
                break;
            case "forestmid_deer1": {
                const deer = RPGMovement.FindChar("deer1");
                deer.LookAtPlayer();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
            } break;
            case "forestmid_deer2": {
                const deer = RPGMovement.FindChar("deer2");

                if (Party.Has("traveller"))
                {
                    deer.LookAwayPlayer();

                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                    return;
                }

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                deer.LookAtPlayer();
                await deer.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
            } break;
            case "forestmid_squirrel": {
                const squirrel = RPGMovement.FindChar("squirrel");
                squirrel.moveSpeed = 6;
                squirrel.charCollision = false;
                
                await squirrel.MoveTowards(Vector2.up);
                await squirrel.MoveTowards(Vector2.up);
                await squirrel.MoveTowards(Vector2.left);
                await squirrel.MoveTowards(Vector2.left);
                await squirrel.MoveTowards(Vector2.down);
                await squirrel.MoveTowards(Vector2.down);
                await squirrel.MoveTowards(Vector2.right);
                await squirrel.MoveTowards(Vector2.right);
                squirrel.LookAtPlayer();

                squirrel.moveSpeed = 4;
                squirrel.charCollision = true;

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestmid_boar": {
                AudioManager.instance.PlaySE("crush_1", 0.6, 1.5);

                const boar = RPGMovement.FindChar("boar");
                boar.LookAtPlayer();
                boar.Jump();

                await Player.instance.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestmid_traveller_set":
                if (!this.GetSwitch("traveller") && !this.GetSwitch("traveller_help")) this.SetSwitch("traveller", true);
                break;
            case "forestmid_traveller": {
                RPGMovement.FindChar("traveller").LookAtPlayer();

                if (this.GetVariable("traveller_lost") >= 1)
                {
                    if (this.GetVariable("traveller_lost") >= 5)
                    {
                        await this.dialogueBox.Type(LocaleManager.Find(`${id}_4`)[0]);
                        this.dialogueBox.SetFace("yoki", "sweatdrop");
                        await this.dialogueBox.Type(LocaleManager.Find(`${id}_4`)[1]);
                    }
                    else if (this.GetVariable("traveller_lost") >= 2) await this.dialogueBox.Type(LocaleManager.Find(`${id}_3`));
                    else if (this.GetVariable("traveller_lost") >= 1)
                    {
                        await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[0]);
                        await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[1]);
                    }

                    this.dialogueBox.Close();

                    this.SetSwitch("traveller_help", true);
                    this.SetSwitch("traveller", false);

                    await Party.Set(1, "traveller");
                    return;
                }
                
                if (this.GetSwitch("traveller_no"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_refused`)[0]);
                    this.dialogueBox.SetFace("yoki", "meditative");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_refused`)[1], true);

                    const choice = await this.DialogueChoice([
                        LocaleManager.Find(`${id}_refused_choices`)[0],
                        LocaleManager.Find(`${id}_refused_choices`)[1]
                    ], 1, 1);

                    if (choice === 1)
                    {
                        this.SetSwitch("traveller_no", true);

                        this.dialogueBox.SetFace("yoki", "think");
                        await this.dialogueBox.Type(LocaleManager.Find(`${id}_refused_no`)[0]);
                        await this.dialogueBox.Type(LocaleManager.Find(`${id}_refused_no`)[1]);
                        this.dialogueBox.Close();
                        return;
                    }

                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_refused_ok`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_refused_ok`)[1]);
                    this.dialogueBox.Close();

                    this.SetSwitch("traveller_help", true);
                    this.SetSwitch("traveller", false);

                    await Party.Set(1, "traveller");
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[1]);
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[2]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[3]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[4]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[5]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[6]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[7]);
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[8]);
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[9]);
                this.dialogueBox.SetFace("yoki", "meditative");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[10], true);

                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_1_choices`)[0],
                    LocaleManager.Find(`${id}_1_choices`)[1]
                ], 1, 1);

                if (choice === 1)
                {
                    this.SetSwitch("traveller_no", true);
                    
                    this.dialogueBox.SetFace("yoki", "think");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_1_no`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_1_no`)[1]);
                    this.dialogueBox.Close();
                    return;
                }

                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1_ok`)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_1_ok`)[1]);
                this.dialogueBox.Close();

                this.SetSwitch("traveller_help", true);
                this.SetSwitch("traveller", false);

                await Party.Set(1, "traveller");
            } break;
            // #endregion
            
            // #region ------------------------------------- forest_path
            // #endregion
            
            // #region ------------------------------------- forest_cove
            case "forestcove_traveller":
                Party.Clear(1);
                await this.WaitTransfer();

                Player.instance.avoidInputs = true;
                this.SetSwitch("traveller_help", false);
                this.SetSwitch("traveller", true);

                if (this.GetVariable("traveller_lost") >= 1)
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_2`)[1]);
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_1`)[1]);
                }

                this.dialogueBox.Close();

                this.AddToVariable("traveller_lost");
                Player.instance.avoidInputs = false;
                break;
            // #endregion
            
            // #region ------------------------------------- forest_deep
            case "forestdeep_wolf": {
                const wolf = RPGMovement.FindChar("wolf");
                const randMove = wolf.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                wolf.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                
                if (!Party.Has("traveller")) this.dialogueBox.Close();
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();

                    AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                    await wolf.Jump();
                    AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                    await wolf.Jump();
                }
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "forestdeep_mole": {
                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[0]);
                    this.dialogueBox.Close();
                }

                const mole = RPGMovement.FindChar("mole");
                await this.Timer(20);
                mole.lockLook = false;
                mole.LookAt(Vector2.left);
                await this.Timer(20);
                mole.LookAt(Vector2.right);
                await this.Timer(20);
                mole.LookAt(Vector2.up);
                await this.Timer(20);

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[1]);
                    this.dialogueBox.Close();
                }

                this.SetSwitch("mole", true);
            } break;
            // #endregion

            // #region ------------------------------------- forest_deeper
            case "forestdeeper_krys":
                RPGMovement.FindChar("krys").LookAtPlayer();

                this.dialogueBox.SetFace("fountain", "krys");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "forestdeeper_zusy": {
                const zusy = RPGMovement.FindChar("zusy");
                const randMove = zusy.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                zusy.LookAtPlayer();

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("fountain", "zusy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("fountain", "zusy");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.Close();

                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "forestdeeper_lerias": {
                const lerias = RPGMovement.FindChar("lerias");
                const randMove = lerias.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                lerias.LookAtPlayer();

                this.dialogueBox.SetFace("fountain", "lerias");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();

                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            // #endregion
            
            // #region ------------------------------------- forest_pocket
            case "forestpocket_deer1": {
                const deer = RPGMovement.FindChar("deer1");
                deer.LookAtPlayer();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
            } break;
            case "forestpocket_deer2": {
                const deer = RPGMovement.FindChar("deer2");
                deer.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestpocket_raccoon": {
                const raccoon = RPGMovement.FindChar("raccoon");
                raccoon.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await raccoon.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestpocket_squirrel": {
                const squirrel = RPGMovement.FindChar("squirrel");
                squirrel.LookAtPlayer();
                AudioManager.instance.PlaySE("crush_1", 0.9, 1.5);
                await squirrel.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestpocket_rabbit": {
                const rabbit = RPGMovement.FindChar("rabbit");

                rabbit.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
                rabbit.LookAwayPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
                rabbit.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestpocket_bird": {
                const bird = RPGMovement.FindChar("bird");

                bird.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await bird.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await bird.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await bird.Jump();

                await this.dialogueBox.Type(LocaleManager.Find(id));

                if (Party.Has("traveller")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                
                this.dialogueBox.Close();
            } break;
            case "forestpocket_stump":
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                this.illustrator.Set(0, "stump", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(40);

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);

                await this.Timer(20);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                if (!this.GetSwitch("stump"))
                {
                    this.SetSwitch("stump", true);
                    this.AddToVariable("illusts");
                }

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[0]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[1]);
                    this.dialogueBox.SetFace("yoki", "smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[2]);
                }
                else if (this.GetSwitch("caina_cafe"))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_caina`));
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_nocaina`));
                }

                this.dialogueBox.Close();
                break;
            case "forestpocket_spar": {
                AudioManager.instance.FadeOutBGM(1);

                this.SetSwitch("stump_touched", true);
                const caina = RPGMovement.FindChar("caina", true);
                const cainaSprRen = caina.GetComponent(SpriteRenderer, true);
                cainaSprRen.color.a = 0;

                await this.Timer(30);

                if (Player.instance.gridPos.x <= 0) caina.TP(new Vector2(0, 9));

                cainaSprRen.color.a = 1;
                AudioManager.instance.PlaySE("door_4", 0.9);

                caina.animateIdle = true;
                caina.moveSpeed = 6;
                await caina.MoveTowards(Vector2.down);
                await caina.MoveTowards(Vector2.down);
                await caina.MoveTowards(Vector2.down);
                await caina.MoveTowards(Vector2.down);
                await caina.MoveTowards(Vector2.down);
                await caina.MoveTowards(Vector2.down);
                await caina.MoveTowards(Vector2.down);
                caina.moveSpeed = 4;

                await this.illustrator.Set(0, "blank", 1);
                await this.Timer(2);
                await this.illustrator.Tint(0, new Color(-1, -1, -1, 0));
                await this.illustrator.Tint(0, Color.clear);
                AudioManager.instance.PlaySE("explosive_whish", 0.8);
                
                await this.Timer(3);
                await this.illustrator.Set(1, "caina_spar_1", 1, new Vector2(-4 / 96, 0), new Vector2(1.02, 1.02));
                await this.illustrator.Tint(0, new Color(-1, -1, -1, 0));

                await this.Timer(3);
                await this.illustrator.Move(1, 1, Vector2.zero, Vector2.one);
                await this.illustrator.Set(2, "caina_spar_1", 1);
                await this.illustrator.Move(2, 0, new Vector2(-1.25, 100 / 96), new Vector2(1.5, 1.5), 10);

                this.dialogueBox.SetFace("yoki", "upset");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);

                this.illustrator.Clear(1);
                this.illustrator.Clear(2);
                AudioManager.instance.PlaySE("land", 0.9);

                await this.Timer(3);
                await this.illustrator.Set(1, "caina_spar_2", 1, new Vector2(-4 / 96, 0), new Vector2(1.02, 1.02));

                await this.Timer(3);
                await this.illustrator.Move(1, 1, Vector2.zero, Vector2.one);
                await this.illustrator.Set(2, "caina_spar_2", 1);
                await this.illustrator.Move(2, 0, new Vector2(-1.25, 100 / 96), new Vector2(1.5, 1.5), 10);

                this.dialogueBox.SetFace("caina", "concerned");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                this.illustrator.Clear(1);
                this.illustrator.Clear(2);
                AudioManager.instance.PlaySE("land", 0.9);

                await this.Timer(3);
                await this.illustrator.Set(1, "caina_spar_3", 1, new Vector2(-4 / 96, 0), new Vector2(1.02, 1.02));

                await this.Timer(3);
                await this.illustrator.Move(1, 1, Vector2.zero, Vector2.one);
                await this.illustrator.Set(2, "caina_spar_3", 1);
                await this.illustrator.Move(2, 0, new Vector2(-1.25, 100 / 96), new Vector2(1.5, 1.5), 10);

                this.dialogueBox.SetFace("yoki", "upset");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);

                this.illustrator.Clear(1);
                this.illustrator.Clear(2);
                AudioManager.instance.PlaySE("crush_1", 0.9);

                await this.Timer(3);
                await this.illustrator.Set(1, "caina_spar_4", 1, new Vector2(-4 / 96, 0), new Vector2(1.02, 1.02));

                await this.Timer(3);
                await this.illustrator.Move(1, 1, Vector2.zero, Vector2.one);
                await this.illustrator.Set(2, "caina_spar_4", 1);
                await this.illustrator.Move(2, 0, new Vector2(-1.25, 100 / 96), new Vector2(1.5, 1.5), 10);

                this.dialogueBox.SetFace("caina", "sneer");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("caina", "sneer");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);

                await this.illustrator.Move(1, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 150 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(1);
                this.illustrator.Clear(2);

                await this.TintAll(new Color(-1, -1, -1, 0));
                this.illustrator.Clear(0);
                await this.Timer(30);

                await this.illustrator.Set(0, "caina_spar_5", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                AudioManager.instance.PlayBGM("caina", 0.2);

                this.dialogueBox.SetFace("caina", "laugh");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.SetFace("caina", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                this.dialogueBox.SetFace("yoki", "think");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                this.dialogueBox.SetFace("caina", "down");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[11]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[12]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[13]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[14]);
                this.dialogueBox.SetFace("caina", "laugh");
                await this.dialogueBox.Type(LocaleManager.Find(id)[15]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[16]);
                this.dialogueBox.SetFace("caina", "down");
                await this.dialogueBox.Type(LocaleManager.Find(id)[17]);
                this.dialogueBox.SetFace("caina", "down");
                await this.dialogueBox.Type(LocaleManager.Find(id)[18]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[19]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[20]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[21]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[22]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[23]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[24]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[25]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[26]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[27]);
                this.dialogueBox.SetFace("caina", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[28]);
                this.dialogueBox.SetFace("caina", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[29]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[30]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[31]);
                this.dialogueBox.SetFace("caina", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[32]);
                this.dialogueBox.SetFace("caina", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[33]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[34]);
                this.dialogueBox.SetFace("caina", "disapproval");
                await this.dialogueBox.Type(LocaleManager.Find(id)[35]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[36]);
                this.dialogueBox.SetFace("yoki", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[37]);
                this.dialogueBox.SetFace("caina", "disapproval");
                await this.dialogueBox.Type(LocaleManager.Find(id)[38]);
                this.dialogueBox.SetFace("caina", "disapproval");
                await this.dialogueBox.Type(LocaleManager.Find(id)[39]);
                this.dialogueBox.SetFace("caina", "concerned");
                await this.dialogueBox.Type(LocaleManager.Find(id)[40]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[41]);
                this.dialogueBox.SetFace("caina", "disapproval");
                await this.dialogueBox.Type(LocaleManager.Find(id)[42]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[43]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[44]);
                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[45]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[46]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[47]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[48]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[49]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[50]);
                this.dialogueBox.Close();

                Player.instance.LookAt(Vector2.up);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(40);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0,
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0,
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);
                await this.Timer(30);

                this.dialogueBox.SetFace("caina", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[51]);
                this.dialogueBox.SetFace("caina", "laugh");
                await this.dialogueBox.Type(LocaleManager.Find(id)[52]);
                this.dialogueBox.Close();

                AudioManager.instance.FadeOutBGM(3);

                await caina.MoveTowards(Vector2.up);
                await caina.MoveTowards(Vector2.up);
                await caina.MoveTowards(Vector2.up);
                await caina.MoveTowards(Vector2.up);
                await caina.MoveTowards(Vector2.up);
                await caina.MoveTowards(Vector2.up);
                await caina.MoveTowards(Vector2.up);

                this.SetSwitch("caina_sparred", true);
                this.AddToVariable("illusts");

                AudioManager.instance.PlayBGM("forest", 0.2);
            } break;
            // #endregion

            // #region ------------------------------------- forest_fork
            case "forestfork_cow":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                
                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[0]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[1]);
                }

                this.dialogueBox.Close();
                break;
            case "forestfork_raccoon":
                RPGMovement.FindChar("raccoon").LookAwayPlayer();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
                break;
            case "forestfork_trouble":
                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[0]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[1]);

                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id));
                }

                this.dialogueBox.Close();
                await Player.instance.MoveTowards(Vector2.left);
                break;
            case "forestfork_deer1": {
                const deer = RPGMovement.FindChar("deer1");
                deer.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestfork_deer2": {
                const deer = RPGMovement.FindChar("deer2");
                deer.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestfork_rabbit": {
                const rabbit = RPGMovement.FindChar("rabbit");

                rabbit.charCollision = false;
                await rabbit.MoveAwayChar(Player.instance);
                await rabbit.MoveToChar(Player.instance);
                rabbit.charCollision = true;

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestfork_frog": {
                const frog = RPGMovement.FindChar("frog");
                frog.LookAtPlayer();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await frog.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await frog.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "forestfork_sign":
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "fork", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(40);

                await this.dialogueBox.Type(LocaleManager.Find(id));

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);
                await this.Timer(20);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                if (!this.GetSwitch("sign"))
                {
                    this.SetSwitch("sign", true);
                    this.AddToVariable("illusts");
                }
                break;
            case "forestfork_sign_back":
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            // #endregion
            
            // #region ------------------------------------- village_path
            case "villagepath_bird1":
            case "villagepath_bird2":
            case "villagepath_bird3":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "villagepath_sign1":
                if (!Player.instance.lookingAt.Equals(Vector2.up))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_back`));
                    this.dialogueBox.Close();
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id));

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[0]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[1]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[2]);
                }

                this.dialogueBox.Close();
                break;
            // #endregion

            // #region ------------------------------------- village
            case "village_dog1":
                RPGMovement.FindChar("dog1").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_dog2": {
                const dog = RPGMovement.FindChar("dog2");
                dog.LookAtPlayer();
                await dog.Jump();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
            } break;
            case "village_cat":
                RPGMovement.FindChar("cat").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_villager1": {
                const villager = RPGMovement.FindChar("villager1");
                const randMove = villager.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                villager.LookAtPlayer();

                if (this.GetSwitch("villager_1"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    this.dialogueBox.SetFace("yoki", "smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                    this.dialogueBox.Close();
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                    this.dialogueBox.Close();

                    this.SetSwitch("villager_1", true);
                }
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "village_villager2": {
                const villager = RPGMovement.FindChar("villager2");
                const randMove = villager.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                villager.LookAtPlayer();

                if (this.GetSwitch("villager_2"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[3]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[4]);
                    this.dialogueBox.Close();
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                    this.dialogueBox.SetFace("yoki", "smile");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                    this.dialogueBox.Close();

                    this.SetSwitch("villager_2", true);
                }
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "village_villager3": {
                const villager = RPGMovement.FindChar("villager3");
                const randMove = villager.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                villager.LookAtPlayer();

                if (this.GetSwitch("villager_3"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                    this.dialogueBox.Close();
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                    this.dialogueBox.Close();

                    this.SetSwitch("villager_3", true);
                }
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "village_villager4": {
                const villager = RPGMovement.FindChar("villager4");
                const randMove = villager.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                villager.LookAtPlayer();

                if (this.GetSwitch("dragon_noticed"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_dragon`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_dragon`)[1]);
                    this.dialogueBox.Close();
                }
                else if (this.GetSwitch("villager_4"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`));
                    this.dialogueBox.Close();
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                    this.dialogueBox.Close();

                    this.SetSwitch("villager_4", true);
                }
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "village_villager5":
                RPGMovement.FindChar("villager5").LookAtPlayer();
                
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "village_villager6":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_hero":
                this.dialogueBox.SetFace("heroes", "chosen one");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_cleric":
                this.dialogueBox.SetFace("heroes", "cleric");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_knight":
                this.dialogueBox.SetFace("heroes", "knight");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_rogue":
                RPGMovement.FindChar("rogue").LookAtPlayer();

                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_este": {
                RPGMovement.FindChar("este").LookAtPlayer();

                if (this.GetSwitch("este_warp"))
                {
                    this.dialogueBox.SetFace("este", null);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_warped`), true);
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    this.dialogueBox.SetFace("este", null);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("este", null);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2], true);
                }

                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_choices`)[0],
                    LocaleManager.Find(`${id}_choices`)[1]
                ], 1);

                this.dialogueBox.SetFace("yoki", "smile");

                if (choice === 1)
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_no`));
                    this.dialogueBox.Close();

                    this.SetSwitch("este_warp", true);
                    return;
                }

                Loader.Ready(21);

                await this.dialogueBox.Type(LocaleManager.Find(`${id}_ok`));
                this.dialogueBox.Close();

                AudioManager.instance.FadeOutBGM(1);

                this.TintAll(new Color(
                    -68 / 255,
                    -68 / 255,
                    -68 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -102 / 255,
                    -102 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -187 / 255,
                    -187 / 255,
                    -187 / 255,
                    0
                ));
                await this.Timer(8);

                Player.instance.LookAt(Vector2.down);
                const transfer = new MapTransfer();
                transfer.pos = new Vector2(0, -5);
                MapTransfer.last = transfer;
                await this.BlackSwitch(21);

                await this.Timer(40);
                await this.TintAll(new Color(
                    -187 / 255,
                    -187 / 255,
                    -187 / 255,
                    0
                ));
                Transitioner.instance.Clear();
                await this.Timer(8);
                await this.TintAll(new Color(
                    -102 / 255,
                    -102 / 255,
                    -102 / 255,
                    0
                ));
                await this.Timer(8);
                this.TintAll(new Color(
                    -68 / 255,
                    -68 / 255,
                    -68 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);
                await this.Timer(8);

                AudioManager.instance.PlayBGM("forest", 0.2);

                this.SetSwitch("este_warp", true);
            } break;
            case "village_shop1":
            case "village_shop2":
            case "village_shop4":
            case "village_shop5":
            case "village_shop6":
            case "village_shop7":
            case "village_shop8":
            case "village_shop9":
            case "village_shop10":
            case "village_shop11":
            case "village_shop12":
            case "village_shop13":
            case "village_shop14":
            case "village_shop15":
            case "village_shop16":
            case "village_shop17":
            case "village_shop18":
            case "village_shop19":
            case "village_shop20":
            case "village_shop21":
            case "village_shop22":
            case "village_shop23":
            case "village_shop24":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_shop3":
            case "village_fruitstand":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "village_cafe":
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.Close();
                break;
            case "village_well":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_wishingwell":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "village_forestsign":
                if (!Player.instance.lookingAt.Equals(Vector2.up))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_back`));
                }
                else await this.dialogueBox.Type(LocaleManager.Find(id));

                this.dialogueBox.Close();
                break;
            case "village_carriagesign":
                if (!Player.instance.lookingAt.Equals(Vector2.up))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_back`));
                }
                else await this.dialogueBox.Type(LocaleManager.Find(id));

                this.dialogueBox.Close();
                break;
            case "village_shrinesign":
                if (!Player.instance.lookingAt.Equals(Vector2.up))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_back`));
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                }

                this.dialogueBox.Close();
                break;
            case "village_veggie":
            case "village_veggie_bad":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "village_postbox":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "village_mail1":
                if (this.GetSwitch("j*bbing"))
                {
                    if (this.GetSwitch("letter_house_1"))
                    {
                        this.dialogueBox.SetFace("yoki", "neutral");
                        await this.dialogueBox.Type(LocaleManager.Find("village_mail_done"));
                        this.dialogueBox.Close();

                        return;
                    }

                    this.SetSwitch("letter_mail_1", true);
                    this.SetSwitch("letter_house_1", true);
                    this.AddToVariable("letters_delivered");

                    this.dialogueBox.SetFace("yoki", "look");

                    if (this.GetVariable("letters_delivered") === 1) await this.dialogueBox.Type(LocaleManager.Find("village_mail_1"));
                    else if (this.GetVariable("letters_delivered") === 2) await this.dialogueBox.Type(LocaleManager.Find("village_mail_2"));
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find("village_mail"));
                }

                this.dialogueBox.Close();
                break;
            case "village_mail2":
                if (this.GetSwitch("j*bbing"))
                {
                    if (this.GetSwitch("letter_house_2"))
                    {
                        this.dialogueBox.SetFace("yoki", "neutral");
                        await this.dialogueBox.Type(LocaleManager.Find("village_mail_done"));
                        this.dialogueBox.Close();

                        return;
                    }

                    this.SetSwitch("letter_mail_2", true);
                    this.SetSwitch("letter_house_2", true);
                    this.AddToVariable("letters_delivered");

                    this.dialogueBox.SetFace("yoki", "look");

                    if (this.GetVariable("letters_delivered") === 1) await this.dialogueBox.Type(LocaleManager.Find("village_mail_1"));
                    else if (this.GetVariable("letters_delivered") === 2) await this.dialogueBox.Type(LocaleManager.Find("village_mail_2"));
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find("village_mail"));
                }

                this.dialogueBox.Close();
                break;
            case "village_mail3":
                if (this.GetSwitch("j*bbing"))
                {
                    if (this.GetSwitch("letter_house_3"))
                    {
                        this.dialogueBox.SetFace("yoki", "neutral");
                        await this.dialogueBox.Type(LocaleManager.Find("village_mail_done"));
                        this.dialogueBox.Close();

                        return;
                    }

                    this.SetSwitch("letter_mail_3", true);
                    this.SetSwitch("letter_house_3", true);
                    this.AddToVariable("letters_delivered");

                    this.dialogueBox.SetFace("yoki", "look");

                    if (this.GetVariable("letters_delivered") === 1) await this.dialogueBox.Type(LocaleManager.Find("village_mail_1"));
                    else if (this.GetVariable("letters_delivered") === 2) await this.dialogueBox.Type(LocaleManager.Find("village_mail_2"));
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find("village_mail"));
                }

                this.dialogueBox.Close();
                break;
            case "village_traveller": {
                await this.WaitTransfer();

                Player.instance.avoidInputs = true;
                Party.Clear(1);
                await this.Timer(20);

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.Close();

                const traveller = RPGMovement.FindChar("traveller");
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.up);

                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.Close();
                
                traveller.moveSpeed = 5;
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                await traveller.MoveTowards(Vector2.down);
                
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.Close();

                this.SetSwitch("traveller_village", true);
                this.SetSwitch("traveller_done", true);
                this.AddToVariable("illusts");

                Player.instance.avoidInputs = false;
            } break;
            // #endregion

            // #region ------------------------------------- village_ride
            case "villageride_pig1": {
                const pig = RPGMovement.FindChar("pig1");
                pig.LookAtPlayer();
                await pig.Jump();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
            } break;
            case "villageride_pig2":
                RPGMovement.FindChar("pig2").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "villageride_pig3": {
                const pig = RPGMovement.FindChar("pig3");
                pig.LookAtPlayer();
                await pig.Jump();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
            } break;
            case "villageride_cow":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "villageride_well":
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "villageride_hors":
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_${+(this.GetVariable("hors") === 10) + 1}`));
                this.dialogueBox.Close();

                this.AddToVariable("hors");
                break;
            case "villageride_ride": {
                if (Player.instance.gridPos.y > 0) RPGMovement.FindChar("driver").LookAt(Vector2.left);
                else RPGMovement.FindChar("driver").LookAtPlayer();

                if (this.GetVariable("carriage_addiction") >= 4)
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[2]);
                    this.dialogueBox.SetFace("yoki", "meditative");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[3], true);
                    
                    this.AddToVariable("carriage_addiction");
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("yoki", "meditative");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2], true);
                }

                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_choices`)[0],
                    LocaleManager.Find(`${id}_choices`)[1]
                ], 1);

                if (choice === 1)
                {
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_no`));
                    this.dialogueBox.Close();
                    
                    return;
                }

                Loader.Ready(29);
                Loader.Ready(27);
                
                if (this.GetVariable("carriage_addiction") < 4) this.AddToVariable("carriage_addiction");

                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_ok`)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_ok`)[1]);
                this.dialogueBox.Close();
                
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                const transfer = new MapTransfer();
                transfer.pos = Vector2.zero;
                MapTransfer.last = transfer;
                await this.BlackSwitch(29);

                await this.Run("carriage_right");
            } break;
            // #endregion

            // #region ------------------------------------- dragonshrine
            case "dragonshrine_dragon": {
                await this.WaitTransfer();

                Player.instance.avoidInputs = true;
                AudioManager.instance.FadeOutBGM(3);
                await this.Timer(60);

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.Close();

                await this.Timer(60);
                const dragon = RPGMovement.FindChar("dragon");
                dragon.moveSpeed = 4;
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);
                await dragon.MoveTowards(Vector2.right);

                await this.Timer(20);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.right);

                await this.Timer(30);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();

                AudioManager.instance.PlayBGM("village", 0.2);
                this.SetSwitch("dragon_forest", true);
                Player.instance.avoidInputs = false;
            } break;
            case "dragonshrine_statue":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            // #endregion
            
            // #region ------------------------------------- territory
            case "territory_soldier": {
                const soldier = RPGMovement.FindChar("soldier");
                const randMove = soldier.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                soldier.LookAtPlayer();

                if (this.GetSwitch("soldier_talk_1"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[3]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[4]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[5]);
                    this.dialogueBox.Close();
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    this.dialogueBox.Close();

                    this.SetSwitch("soldier_talk_1", true);
                }
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "territory_heroes": {
                AudioManager.instance.FadeOutBGM(1);
                CamCtrl.current.Scroll(new Vector2(0, -3.5), 4);
                await this.Timer(120);

                const hero = RPGMovement.FindChar("hero");
                const cleric = RPGMovement.FindChar("cleric");
                const knight = RPGMovement.FindChar("knight");
                const rogue = RPGMovement.FindChar("rogue");

                await hero.MoveTowards(Vector2.down);
                hero.animateIdle = true;

                AudioManager.instance.PlayBGM("heroes", 0.2);

                this.dialogueBox.SetFace("heroes", "chosen one");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.Close();

                await cleric.MoveTowards(Vector2.down);
                cleric.animateIdle = true;
                this.dialogueBox.SetFace("heroes", "cleric");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();

                await knight.MoveTowards(Vector2.up);
                knight.animateIdle = true;
                this.dialogueBox.SetFace("heroes", "knight");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.Close();

                await rogue.MoveTowards(Vector2.up);
                rogue.animateIdle = true;
                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("heroes", "chosen one");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.Close();

                (async () => {
                    hero.charCollision = false;
                    hero.moveSpeed = 4;
                    await hero.MoveTowards(Vector2.down);
                    await hero.MoveTowards(Vector2.left);
                    await hero.MoveTowards(Vector2.left);
                    await hero.MoveTowards(Vector2.left);
                    await hero.MoveTowards(Vector2.left);
                    await hero.MoveTowards(Vector2.down);
                    await hero.MoveTowards(Vector2.left);
                    await hero.MoveTowards(Vector2.left);
                    await hero.MoveTowards(Vector2.left);
                    await hero.MoveTowards(Vector2.left);
                    hero.gameObject.SetActive(false);
                })();

                await this.Timer(20);

                (async () => {
                    cleric.charCollision = false;
                    cleric.moveSpeed = 4;
                    await cleric.MoveTowards(Vector2.down);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.down);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.left);
                    await cleric.MoveTowards(Vector2.left);
                    cleric.gameObject.SetActive(false);
                })();

                await this.Timer(90);

                (async () => {
                    knight.charCollision = false;
                    knight.moveSpeed = 4;
                    await knight.MoveTowards(Vector2.left);
                    await knight.MoveTowards(Vector2.left);
                    await knight.MoveTowards(Vector2.left);
                    await knight.MoveTowards(Vector2.left);
                    await knight.MoveTowards(Vector2.left);
                    await knight.MoveTowards(Vector2.left);
                    await knight.MoveTowards(Vector2.left);
                    await knight.MoveTowards(Vector2.left);
                    knight.gameObject.SetActive(false);
                })();

                await this.Timer(40);

                (async () => {
                    rogue.charCollision = false;
                    rogue.moveSpeed = 4;
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    await this.Timer(90);
                    await rogue.LookAt(Vector2.right);
                    await this.Timer(90);
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    await rogue.MoveTowards(Vector2.left);
                    rogue.gameObject.SetActive(false);
                })();

                await this.Timer(360);

                CamCtrl.current.Scroll(new Vector2(0, 3.5), 4);
                AudioManager.instance.FadeOutBGM(1);
                await this.Timer(120);

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.Close();

                AudioManager.instance.PlayBGM("village", 0.2);
                this.SetSwitch("heroes_set", true);
            } break;
            case "territory_adventure": {
                Loader.Ready(21);

                AudioManager.instance.FadeOutBGM(1);
                Player.instance.GetComponent(SpriteRenderer).color.a = 0;
                await this.Timer(60);

                this.SetSwitch("anotherland", true);
                CamCtrl.current.Scroll(new Vector2(2, 0), 4);
                await this.Timer(90);

                const claire = RPGMovement.FindChar("claire");
                await claire.MoveTowards(Vector2.down);
                await claire.MoveTowards(Vector2.down);
                await claire.MoveTowards(Vector2.down);
                await claire.MoveTowards(Vector2.down);
                await claire.MoveTowards(Vector2.down);
                await claire.MoveTowards(Vector2.left);
                claire.animateIdle = true;
                await this.Timer(60);

                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("claire", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();

                await this.TintAll(new Color(
                    -34 / 255,
                    -34 / 255,
                    -34 / 255,
                    0
                ));
                await this.Timer(10);
                await this.TintAll(new Color(
                    -85 / 255,
                    -85 / 255,
                    -85 / 255,
                    0
                ));
                await this.Timer(10);
                await this.TintAll(new Color(
                    -170 / 255,
                    -170 / 255,
                    -170 / 255,
                    0
                ));
                await this.Timer(10);
                await this.TintAll(new Color(-1, -1, -1, 0));

                this.SetSwitch("adventure_start", true);

                const transfer = new MapTransfer();
                transfer.pos = new Vector2(0, -5);
                MapTransfer.last = transfer;
                await this.BlackSwitch(21);
            } break;
            case "territory_leave":
                if (this.GetSwitch("adventure_done"))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_done`));
                    this.dialogueBox.Close();

                    await Player.instance.MoveTowards(Vector2.right);

                    return;
                }

                if (this.GetSwitch("claire_fly")) return;

                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.Close();

                await Player.instance.MoveTowards(Vector2.right);
                break;
            // #endregion
            
            // #region ------------------------------------- town_path
            case "townpath_squirrel1": {
                const squirrel = RPGMovement.FindChar("squirrel1");
                squirrel.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "townpath_squirrel2":
                if (Party.Has("traveller")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                else
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id));
                }
                
                this.dialogueBox.Close();
                break;
            case "townpath_squirrel3": {
                const squirrel = RPGMovement.FindChar("squirrel3");
                squirrel.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "townpath_wolf":
                RPGMovement.FindChar("wolf").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                if (Party.Has("traveller")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                this.dialogueBox.Close();
                break;
            case "townpath_fox":
                RPGMovement.FindChar("fox").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                if (Party.Has("traveller")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                this.dialogueBox.Close();
                break;
            case "townpath_raccoon1": {
                const raccoon = RPGMovement.FindChar("raccoon1");
                raccoon.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await raccoon.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await raccoon.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await raccoon.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "townpath_raccoon3":
                RPGMovement.FindChar("raccoon3").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                if (Party.Has("traveller")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                this.dialogueBox.Close();
                break;
            case "townpath_boar":
                RPGMovement.FindChar("boar").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                if (Party.Has("traveller")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                this.dialogueBox.Close();
                break;
            case "townpath_bear":
                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[1]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[2]);
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                }

                this.dialogueBox.Close();
                break;
            case "townpath_sign1":
                if (!Player.instance.lookingAt.Equals(Vector2.up))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_back`));
                    this.dialogueBox.Close();
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id));

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[0]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[1]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`)[2]);
                }

                this.dialogueBox.Close();
                break;
            case "townpath_sign2":
                if (!Player.instance.lookingAt.Equals(Vector2.up))
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_back`));
                    this.dialogueBox.Close();
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id));

                if (Party.Has("traveller")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));

                this.dialogueBox.Close();
                break;
            case "townpath_cave":
                if (!Party.Has("traveller")) return;
                
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                Player.instance.MoveTowards(Vector2.down);
                break;
            // #endregion

            // #region ------------------------------------- lake
            case "lake_frog1": {
                const frog = RPGMovement.FindChar("frog1");
                frog.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await frog.Jump();

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "lake_frog2": {
                const frog = RPGMovement.FindChar("frog2");
                frog.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await frog.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await frog.Jump();
                frog.collision = false;
                await frog.MoveTowards(Vector2.down);
                await frog.MoveTowards(Vector2.down);

                this.SetSwitch("frog", true);

                if (Party.Has("traveller"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_traveller`));
                    this.dialogueBox.Close();
                }
            } break;
            case "lake_frog3": {
                const frog = RPGMovement.FindChar("frog3");
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await frog.Jump();
                await frog.MoveTowards(Vector2.left);
                await frog.MoveTowards(Vector2.right);
            } break;
            case "lake_frog4": {
                const frog = RPGMovement.FindChar("frog4");
                frog.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await frog.Jump();
            } break;
            case "lake_raccoon1": {
                const raccoon = RPGMovement.FindChar("raccoon1");
                raccoon.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await raccoon.Jump();
            } break;
            case "lake_raccoon2":
                RPGMovement.FindChar("raccoon2").LookAwayPlayer();
                break;
            case "lake_traveller": {
                const traveller = RPGMovement.FindChar("traveller");
                traveller.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();

                traveller.LookAt(Vector2.up);
            } break;
            case "lake_boss":
                if (this.GetSwitch("lake_creature")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`));
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id));
                    this.SetSwitch("lake_creature", true);
                }

                this.dialogueBox.Close();
                break;
            case "lake_traveller_bye":
                if (!Party.Has("traveller")) return;

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();

                const startPos = Player.instance.gridPos;

                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.down);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);

                if (startPos.x <= -21) await Player.instance.MoveTowards(Vector2.right);
                if (startPos.x === -22) await Player.instance.MoveTowards(Vector2.right);

                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.up);
                await Player.instance.MoveTowards(Vector2.right);
                await Player.instance.MoveTowards(Vector2.right);
                Player.instance.LookAt(Vector2.up);

                CamCtrl.current.Scroll(new Vector2(0, 1.5), 2);
                await this.Timer(220);

                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.Close();

                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "traveller", 50 / 255)
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[11]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[12]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[13]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[14]);

                this.SetSwitch("traveller_done", true);
                Party.Clear(1);
                this.SetSwitch("traveller_lake", true);

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0)
                await this.Timer(20);

                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);

                this.AddToVariable("illusts");
                break;
            // #endregion

            // #region ------------------------------------- castle_road
            case "castleroad_bird": {
                const bird = RPGMovement.FindChar("bird");

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await bird.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await bird.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await bird.Jump();
            } break;
            case "castleroad_rabbit1": {
                const rabbit = RPGMovement.FindChar("rabbit1");
                rabbit.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
            } break;
            case "castleroad_rabbit2": {
                const rabbit = RPGMovement.FindChar("rabbit2");
                rabbit.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await rabbit.Jump();
            } break;
            case "castleroad_squirrel":
                RPGMovement.FindChar("squirrel1").LookAwayPlayer();
                break;
            case "castleroad_raccoon": {
                const raccoon = RPGMovement.FindChar("raccoon");
                raccoon.LookAtPlayer();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await raccoon.Jump();
                raccoon.LookAwayPlayer();
            } break;
            case "castleroad_soldier1":
                RPGMovement.FindChar("soldier1").LookAtPlayer();

                if (this.GetSwitch("forestsoldier_1"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                    this.dialogueBox.SetFace("yoki", "unsure")
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[3]);
                    this.dialogueBox.Close();
                    
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "look")
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "unsure")
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.Close();

                this.SetSwitch("forestsoldier_1", true);
                break;
            case "castleroad_soldier2":
                RPGMovement.FindChar("soldier2").LookAtPlayer();

                if (this.GetSwitch("forestsoldier_2"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`));
                    this.dialogueBox.Close();
                    
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();

                this.SetSwitch("forestsoldier_2", true);
                break;
            // #endregion

            // #region ------------------------------------- graveyard
            case "graveyard_ghost1": {
                const ghost = RPGMovement.FindChar("ghost1");
                const sprRenderer = ghost.GetComponent(SpriteRenderer);

                ghost.LookAt(Vector2.up);
                await this.Timer(20);
                sprRenderer.color.a = 100 / 255;
                await this.Timer(20);
                ghost.gameObject.SetActive(false);
            } break;
            case "graveyard_ghost2": {
                const ghost = RPGMovement.FindChar("ghost2");
                const sprRenderer = ghost.GetComponent(SpriteRenderer);

                ghost.LookAt(Vector2.up);
                await this.Timer(20);
                sprRenderer.color.a = 100 / 255;
                await this.Timer(20);
                ghost.gameObject.SetActive(false);
            } break;
            case "graveyard_ghost6": {
                const ghost = RPGMovement.FindChar("ghost6");
                const sprRenderer = ghost.GetComponent(SpriteRenderer);

                ghost.LookAt(Vector2.up);
                await this.Timer(20);
                sprRenderer.color.a = 100 / 255;
                await this.Timer(20);

                this.SetSwitch("shackghost", true);
            } break;
            case "graveyard_ghost7": {
                const ghost = RPGMovement.FindChar("ghost7");
                const sprRenderer = ghost.GetComponent(SpriteRenderer);

                ghost.LookAt(Vector2.up);
                await this.Timer(20);
                sprRenderer.color.a = 100 / 255;
                await this.Timer(20);
                ghost.gameObject.SetActive(false);
            } break;
            case "graveyard_chillghost":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "graveyard_corpse": {
                const ghost = RPGMovement.FindChar("chillghost");

                AudioManager.instance.PlaySE("crush_1", 0.25, 1.5);
                ghost.animateIdle = false;
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                ghost.animateIdle = true;
            } break;
            case "graveyard_headstone":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            // #endregion

            // #region ------------------------------------- castletown_gate
            case "castletowngate_soldier":
                if (this.GetSwitch("soldier_annoying"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[3]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[4]);
                    this.dialogueBox.Close();

                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.Close();

                this.SetSwitch("soldier_annoying", true);
                break;
            case "castletowngate_frank":
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "castletowngate_ride": {
                RPGMovement.FindChar("driver").LookAtPlayer();

                if (this.GetVariable("carriage_addiction") >= 4)
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[2]);
                    this.dialogueBox.SetFace("yoki", "meditative");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_addicted`)[3], true);
                    
                    this.AddToVariable("carriage_addiction");
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("yoki", "meditative");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2], true);
                }

                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_choices`)[0],
                    LocaleManager.Find(`${id}_choices`)[1]
                ], 1);

                if (choice === 1)
                {
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_no`));
                    this.dialogueBox.Close();
                    
                    return;
                }

                Loader.Ready(30);
                Loader.Ready(15);
                
                if (this.GetVariable("carriage_addiction") < 4) this.AddToVariable("carriage_addiction");

                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_ok`)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(`${id}_ok`)[1]);
                this.dialogueBox.Close();
                
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                const transfer = new MapTransfer();
                transfer.pos = Vector2.zero;
                MapTransfer.last = transfer;
                await this.BlackSwitch(30);

                await this.Run("carriage_left");
            } break;
            // #endregion

            // #region ------------------------------------- castletown_west
            case "castletownwest_townsperson1": {
                const townsperson = RPGMovement.FindChar("townsperson1");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                if (this.GetSwitch("townsperson_1"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                    this.SetSwitch("townsperson_1", true);
                }

                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletownwest_townsperson2": {
                const townsperson = RPGMovement.FindChar("townsperson2");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletownwest_townsperson3": {
                const townsperson = RPGMovement.FindChar("townsperson3");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                if (this.GetSwitch("townsperson_3"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                    this.SetSwitch("townsperson_3", true);
                }

                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletownwest_soldier1": {
                const soldier = RPGMovement.FindChar("soldier1");
                const randMove = soldier.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                soldier.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletownwest_soldierb":
                RPGMovement.FindChar("soldierb").LookAtPlayer();

                if (this.GetSwitch("soldier_talk_11"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    this.dialogueBox.Close();
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();

                this.SetSwitch("soldier_talk_11", true);
                break;
            case "castletownwest_soldierd":
                RPGMovement.FindChar("soldierd").LookAtPlayer();

                if (this.GetSwitch("soldier_talk_12"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    this.dialogueBox.Close();
                    return;
                }

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                if (this.GetSwitch("prince_2"))
                {
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_job`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_job`)[1]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_job`)[2]);
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_nojob`));
                }

                this.dialogueBox.Close();

                this.SetSwitch("soldier_talk_12", true);
                break;
            case "castletownwest_fmaid":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            // #endregion

            // #region ------------------------------------- castle
            case "castle_bird1": {
                const bird = RPGMovement.FindChar("bird1");
                await bird.Jump();
                await bird.Jump();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
            } break;
            case "castle_bird2":
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "castle_townsperson1": {
                const townsperson = RPGMovement.FindChar("townsperson1");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castle_townsperson2": {
                const townsperson = RPGMovement.FindChar("townsperson2");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                if (this.GetSwitch("townsperson_2"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                    this.SetSwitch("townsperson_2", true);
                }

                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castle_soldiera":
                RPGMovement.FindChar("soldiera").LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));

                this.dialogueBox.SetFace("yoki", "unsure smile")
                if (this.GetSwitch("prince_2")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_job`));
                else await this.dialogueBox.Type(LocaleManager.Find(`${id}_nojob`));

                this.dialogueBox.Close();
                break;
            case "castle_soldierb":
                RPGMovement.FindChar("soldierb").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "castle_fountain":
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            // #endregion

            // #region ------------------------------------- castletown_east
            case "castletowneast_townsperson1": {
                const townsperson = RPGMovement.FindChar("townsperson1");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                if (this.GetSwitch("townsperson_4"))
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                }
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    this.dialogueBox.SetFace("yoki", "unsure");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3]);

                    this.SetSwitch("townsperson_4", true);
                }

                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletowneast_townsperson2": {
                const townsperson = RPGMovement.FindChar("townsperson2");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                if (this.GetSwitch("townsperson_6")) await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`));
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                    this.SetSwitch("townsperson_6", true);
                }

                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletowneast_soldier1":
                RPGMovement.FindChar("soldier1").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.Close();
                break;
            case "castletowneast_soldierab": {
                const soldierA = RPGMovement.FindChar("soldiera");
                const soldierB = RPGMovement.FindChar("soldierb");

                soldierB.animateIdle = false;

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);

                soldierA.animateIdle = false;
                soldierB.animateIdle = true;
                
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                
                soldierB.animateIdle = false;
                soldierA.animateIdle = true;

                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.Close();

                soldierB.animateIdle = true;
            } break;
            case "castletowneast_cat1": {
                const townsperson = RPGMovement.FindChar("cat1");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletowneast_cat2":
                RPGMovement.FindChar("cat2").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "castletowneast_cat3": {
                const townsperson = RPGMovement.FindChar("cat3");
                const randMove = townsperson.GetComponent(RandomMove, true);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                townsperson.LookAtPlayer();

                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                
                randMove.enabled = true;
                randMove.ResetTime();
            } break;
            case "castletowneast_cat4":
                RPGMovement.FindChar("cat4").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            case "castletowneast_cat5":
                RPGMovement.FindChar("cat5").LookAtPlayer();
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            // #endregion
            
            // #region ------------------------------------- castletown_alley
            case "castletownalley_rogue": {
                const rogue = RPGMovement.FindChar("rogue");

                if (this.GetSwitch("heroes_rogue"))
                {
                    rogue.LookAtPlayer();

                    this.dialogueBox.SetFace("heroes", "rogue");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`));
                    this.dialogueBox.Close();

                    break;
                }

                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);

                rogue.lockLook = false;
                rogue.LookAtPlayer();

                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                this.dialogueBox.SetFace("heroes", "rogue");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                this.dialogueBox.SetFace("yoki", "meditative");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.Close();

                this.SetSwitch("heroes_rogue", true);
            } break;
            case "castletownalley_skull":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                this.dialogueBox.Close();
                break;
            // #endregion

            // #region ------------------------------------- dragoncliff
            case "dragoncliff_reveal": {
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(-1, -1, -1, 0));

                await this.illustrator.Set(0, "dragon_1", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                this.dialogueBox.Close();

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);

                await this.illustrator.Set(0, "dragon_2", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("dragon", "dismiss");
                await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                this.dialogueBox.SetFace("dragon", "dismiss");
                await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                this.dialogueBox.Close();

                await this.illustrator.Set(1, "dragon_3", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                await this.Timer(20);
                this.illustrator.Clear(0);

                this.dialogueBox.SetFace("dragon", "stern");
                await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                this.dialogueBox.Close();

                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(1);

                await this.illustrator.Set(0, "dragon_4", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(60);

                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                this.dialogueBox.SetFace("dragon", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[11]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[12]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[13]);
                this.dialogueBox.SetFace("dragon", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[14]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[15]);
                this.dialogueBox.SetFace("dragon", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[16]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[17]);
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[18]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[19]);
                this.dialogueBox.SetFace("dragon", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[20]);
                this.dialogueBox.SetFace("dragon", "dismiss");
                await this.dialogueBox.Type(LocaleManager.Find(id)[21]);
                this.dialogueBox.Close();

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);

                await this.illustrator.Set(0, "dragon_5", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("dragon", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[22]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[23]);
                this.dialogueBox.SetFace("dragon", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[24]);
                this.dialogueBox.SetFace("dragon", "dismiss");
                await this.dialogueBox.Type(LocaleManager.Find(id)[25]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[26]);
                this.dialogueBox.SetFace("dragon", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[27]);
                this.dialogueBox.Close();

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);

                await this.illustrator.Set(0, "dragon_6", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type(LocaleManager.Find(id)[28]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[29]);
                this.dialogueBox.SetFace("dragon", "dismiss");
                await this.dialogueBox.Type(LocaleManager.Find(id)[30]);
                this.dialogueBox.Close();

                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);

                await this.illustrator.Set(0, "dragon_7", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.SetSwitch("dragon_transformed", true);

                this.dialogueBox.SetFace("dragon", "smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[31]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[32]);
                this.dialogueBox.Close();

                AudioManager.instance.PlaySE("wind_whish3", 0.9);

                await this.illustrator.Set(1, "blank", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 150 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(1, 1);
                await this.Timer(30);

                await this.illustrator.Set(0, "dragon_8", 50 / 255, new Vector2(0, 3.5));
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(40);
                this.illustrator.Clear(1);

                await this.illustrator.Move(0, null, new Vector2(0, 50 / 96), null, 60);
                AudioManager.instance.PlaySE("dragon", 0.9);
                await this.illustrator.Move(0, null, Vector2.zero, null, 60);
                await this.Timer(30);
                
                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);

                Player.instance.TP(new Vector2(0, 3));
                CamCtrl.current.Scroll(new Vector2(0, 3.5), 6);

                await this.illustrator.Set(0, "dragon_9", 50 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 1);
                await this.Timer(20);

                this.dialogueBox.SetFace("dragon", "reveal");
                await this.dialogueBox.Type(LocaleManager.Find(id)[33]);
                this.dialogueBox.SetFace("dragon", "reveal");
                await this.dialogueBox.Type(LocaleManager.Find(id)[34]);
                this.dialogueBox.Close();

                await this.illustrator.Move(0, 200 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 150 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 100 / 255);
                await this.Timer(8);
                await this.illustrator.Move(0, 50 / 255);
                await this.Timer(8);
                this.illustrator.Clear(0);

                AudioManager.instance.PlayBGM("dragon", 0.2);

                await this.Timer(40);
                await this.TintAll(new Color(
                    -80 / 255,
                    -100 / 255,
                    -100 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(new Color(
                    -40 / 255,
                    -50 / 255,
                    -50 / 255,
                    0
                ));
                await this.Timer(8);
                await this.TintAll(Color.clear);
                await this.Timer(40);

                Player.instance.lockLook = true;
                Player.instance.moveSpeed = 3;
                await Player.instance.MoveTowards(Vector2.down);
                Player.instance.lockLook = false;
                Player.instance.moveSpeed = 4;

                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[35]);
                this.dialogueBox.SetFace("yoki", "sweatdrop");
                await this.dialogueBox.Type(LocaleManager.Find(id)[36]);
                this.dialogueBox.SetFace("yoki", "upset");
                await this.dialogueBox.Type(LocaleManager.Find(id)[37]);
                this.dialogueBox.Close();

                const dragon = RPGMovement.FindChar("dragon");
                dragon.LookAt(Vector2.left);
                dragon.moveSpeed = 6;
                AudioManager.instance.PlaySE("dragon", 0.9);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[38]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[39]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[40]);
                this.dialogueBox.Close();

                dragon.moveSpeed = 4;
                dragon.LookAt(Vector2.right);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[41]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[42]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[43]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[44]);
                this.dialogueBox.Close();

                dragon.LookAt(Vector2.down);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[45]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[46]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[47]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[48]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[49]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[50]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[51]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[52]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[53]);
                this.dialogueBox.SetFace("yoki", "think");
                await this.dialogueBox.Type(LocaleManager.Find(id)[54]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[55]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[56]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[57]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[58]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[59]);
                this.dialogueBox.Close();

                dragon.LookAt(Vector2.right);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[60]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[61]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[62]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[63]);
                this.dialogueBox.Close();

                dragon.LookAt(Vector2.down);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[64]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[65]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[66]);
                this.dialogueBox.Close();

                dragon.LookAt(Vector2.right);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[67]);
                this.dialogueBox.Close();
                
                dragon.LookAt(Vector2.down);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[68]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[69]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[70]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[71]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[72]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[73]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[74]);
                this.dialogueBox.SetFace("yoki", "surprised");
                await this.dialogueBox.Type(LocaleManager.Find(id)[75]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[76]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[77]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[78]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[79]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[80]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[81]);
                this.dialogueBox.Close();

                dragon.animateIdle = false;

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[82]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[83]);
                this.dialogueBox.Close();

                dragon.animateIdle = true;

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[84]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[85]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[86]);
                this.dialogueBox.Close();

                dragon.LookAt(Vector2.right);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[87]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[88]);
                this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find(id)[89]);
                this.dialogueBox.SetFace("yoki", "disheartened");
                await this.dialogueBox.Type(LocaleManager.Find(id)[90]);
                this.dialogueBox.Close();

                dragon.LookAt(Vector2.down);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[91]);
                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[92]);
                this.dialogueBox.Close();

                dragon.moveSpeed = 6;
                dragon.LookAt(Vector2.left);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[93]);

                AudioManager.instance.PlaySE("dragon", 0.9);

                this.dialogueBox.SetFace("dragon", "familiar");
                await this.dialogueBox.Type(LocaleManager.Find(id)[94]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[95]);
                this.dialogueBox.SetFace("yoki", "unsure smile");
                await this.dialogueBox.Type(LocaleManager.Find(id)[96]);
                this.dialogueBox.Close();

                await this.Timer(20);
                CamCtrl.current.Scroll(new Vector2(0, -3.5), 4);
                await this.Timer(60);

                dragon.moveSpeed = 2;
                dragon.LookAt(Vector2.down);
                await this.Timer(60);

                this.SetSwitch("dragon_done", true);
                this.AddToVariable("illusts");
            } break;
            case "dragoncliff_dragon":
                CamCtrl.current.Scroll(new Vector2(0, 2.5), 4);
                await this.Timer(90);

                if (this.GetSwitch("dragon_talked"))
                {
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[0]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[1]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[2]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[3]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[4]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_talked`)[5]);
                }
                else
                {
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[3]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[4]);
                    this.dialogueBox.SetFace("yoki", "look");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[5]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[6]);
                    this.dialogueBox.SetFace("yoki", "unsure smile");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[7]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[8]);
                    this.dialogueBox.SetFace("yoki", "neutral");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[9]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[10]);
                    this.dialogueBox.SetFace("dragon", "familiar");
                    await this.dialogueBox.Type(LocaleManager.Find(id)[11]);

                    this.SetSwitch("dragon_talked", true);
                }

                this.dialogueBox.Close();

                CamCtrl.current.Scroll(new Vector2(0, -2.5), 4);
                await this.Timer(90);
                break;
            // #endregion
        }

        await this.#ProcessCommonEvents();
    }

    static async TransferEvent (from, to, event)
    {
        const id = `${from}_${to}`;

        switch (id)
        {
            case "4_5":
                if (event === 2)
                {
                    this.AddToVariable("zera_athouse", -1);
                    this.SetSwitch("zera_left", true);
                }
                break;
            case "5_4":
                if (event === 1 && this.GetVariable("illusts") === 28 && this.GetVariable("zera_talkcount") === 0) Player.instance.TP(new Vector2(-4, -20));
                break;
            case "21_4":
                if (event === 1 && this.GetVariable("illusts") === 28 && this.GetVariable("zera_talkcount") === 0) Player.instance.TP(Vector2.Add(Player.instance.gridPos, new Vector2(0, -3)));
                break;

            case "7_8":
                if (event === 1 && this.GetSwitch("bird_form")) Player.instance.TP(new Vector2(-6, 7));
                break;

            case "16_20":
                if (event === 0)
                {
                    this.SetVariable("zera_manor", Math.RandomInt(1, 4));

                    if (this.GetVariable("zera_manor") >= 4) AudioManager.instance.FadeOutBGM(1);
                }
                break;
            case "20_16":
                if (event === 1 && this.GetVariable("zera_manor") >= 4) AudioManager.instance.PlayBGM("forest", 0.2);
                break;

            case "11_12":
                if (event === 0) AudioManager.instance.FadeOutBGM(10);
                else if (event === 1) AudioManager.instance.PlayBGM("village", 0.2);
                break;
            case "12_11":
                if (event === 0) AudioManager.instance.FadeOutBGM(1);
                else if (event === 2) AudioManager.instance.PlayBGM("forest", 0.2);
                break;
            
            case "25_26":
                if (event === 0) AudioManager.instance.FadeOutBGM(1);
                else if (event === 2) AudioManager.instance.PlayBGM("graveyard", 0.2);
                break;
            case "26_25":
                if (event === 0) AudioManager.instance.FadeOutBGM(1);
                else if (event === 2) AudioManager.instance.PlayBGM("forest", 0.2);
                break;
        
            case "27_28":
                if (event === 0)
                {
                    AudioManager.instance.FadeOutBGM(1);
                    AudioManager.instance.PlaySE("door_5", 0.6, 1.2);
                }
                else if (event === 2) AudioManager.instance.PlayBGM("castletown", 0.2);
                break
            case "28_27":
                if (event === 0)
                {
                    AudioManager.instance.FadeOutBGM(1);
                    AudioManager.instance.PlaySE("door_5", 0.6, 1.2);
                }
                else if (event === 2) AudioManager.instance.PlayBGM("forest", 0.2);
                break

            case "34_35":
                if (event === 0) AudioManager.instance.FadeOutBGM(1);
                else if (event === 2 && this.GetSwitch("dragon_transformed")) AudioManager.instance.PlayBGM("dragon", 0.2);
                break;
            case "35_34":
                if (event === 0) AudioManager.instance.FadeOutBGM(1);
                else if (event === 2) AudioManager.instance.PlayBGM("forest", 0.2);
                break;
            
            case "32_36":
            case "36_32":
                if (event === 0)
                {
                    AudioManager.instance.FadeOutBGM(1);
                    AudioManager.instance.PlaySE("door_5", 0.6, 1.2);
                }
                break;
            
            case "36_38":
            case "38_36":
                if (event === 0)
                {
                    AudioManager.instance.FadeOutBGM(1);
                    AudioManager.instance.PlaySE("stair_5", 0.6, 1.2);
                }
                break;
        }
    }

    static async DialogueChoice (choices, nahChoice, pos = 2)
    {
        this.dialogueChoiceBox.transform.parent = Camera.main?.transform;
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
            0.5 * (this.dialogueBox.spriteRenderer.size.x - this.dialogueChoiceBox.spriteRenderer.size.x) * (pos - 1),
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

    static async WaitOk ()
    {
        let endCallback = () => { };
        
        const updateCallback = () => {
            if (!InputManager.IsPressed("ok")) return;

            PlayerLoop.onAfterUpdate.Remove(updateCallback);
            endCallback();
        };
        PlayerLoop.onAfterUpdate.Add(updateCallback);

        await new Promise(resolve => endCallback = resolve);
    }

    static async WaitTransfer ()
    {
        await new Promise(resolve => {
            const callback = () => {
                Transitioner.instance.onTintOut.Remove(callback);
                resolve();
            };
            Transitioner.instance.onTintOut.Add(callback);
        });
    }

    static async BlackSwitch (scene)
    {
        Transitioner.instance.SetFadeIn();
        const switchingCall = () => {
            Loader.onSwitching.Remove(switchingCall);
            Transitioner.instance.SetFadeIn();
        };
        Loader.onSwitching.Add(switchingCall);
        
        let resolveCall = () => { };
        const switchCall = () => {
            Loader.onSwitchEnd.Remove(switchCall);
            Transitioner.instance.SetFadeIn();
            resolveCall();
        };
        Loader.onSwitchEnd.Add(switchCall);

        Loader.Switch(scene);

        await new Promise(resolve => resolveCall = resolve);
        await this.Timer(1);
    }

    static async TintAll (color)
    {
        const renderers = GameObject.FindComponents(Renderer, true).filter(item => !([3, 4, 5]).includes(item.sortingLayer));

        for (let i = 0; i < renderers.length; i++) renderers[i].tint = color;

        await this.Timer(1);
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
        this.#switches.set(name, state);
        this.onBeforeUpdate.Invoke();
        this.onUpdate.Invoke();
    }

    static SetVariable (name, value)
    {
        this.#variables.set(name, value);
        this.onBeforeUpdate.Invoke();
        this.onUpdate.Invoke();
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
            if (data[i] == null)
            {
                i++;
                return;
            }

            this.#switches.set(key, data[i]);
            i++;
        });
    }

    static LoadVariables (data)
    {
        let i = 0;

        this.#variables.forEach((value, key) => {
            if (data[i] == null)
            {
                i++;
                return;
            }

            this.#variables.set(key, data[i]);
            i++;
        });
    }
}

EventSystem.Init();