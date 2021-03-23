const bySport = require("../../../util/bySport");
const base = require("../../base");

module.exports = class {
	data() {
		return {
			...base("md"),
			title: "Game Attributes Customization",
		};
	}

	render({ gameName, proLeagueAbbrev, sport }) {
		return `<p>
    If you haven't already, first read
    <a href="/${sport}/manual/customization/">the customization overview</a>.
</p>
<p>
    "Game Attributes" refers to some high-level settings that define the state of
    your game. Almost all of them are editable in God Mode, but you can edit them in a League File too.
</p>
<p>
    When making a League File, don't have to specify them. Any you
    leave out will just get their default values. Some attributes that might be
    worth playing with are described here:
</p>
<pre>
{
    "version": 43,
    "gameAttributes": {
        "userTid": 15,
        "phase": 0,
        "daysLeft": 0,
        "ownerMood": {
            "wins": 0,
            "playoffs": 0,
            "money": 0
        },
        "season": 2013,
        "startingSeason": 2013,
        "gracePeriodEnd": 2015,
        "numGamesPlayoffSeries": ${bySport(
					{
						basketball: "[7, 7, 7, 7]",
						football: "[1, 1, 1, 1]",
						hockey: "[7, 7, 7, 7]",
					},
					sport,
				)},
        ${bySport(
					{
						basketball: `"confs": [
            {"cid": 0, "name": "Eastern Conference"},
            {"cid": 1, "name": "Western Conference"}
        ],
        "divs": [
            {"did": 0, "cid": 0, "name": "Atlantic"},
            {"did": 1, "cid": 0, "name": "Central"},
            {"did": 2, "cid": 0, "name": "Southeast"},
            {"did": 3, "cid": 1, "name": "Southwest"},
            {"did": 4, "cid": 1, "name": "Northwest"},
            {"did": 5, "cid": 1, "name": "Pacific"}
        ]`,
						football: `"confs": [
            {"cid": 0, "name": "American Conference"},
            {"cid": 1, "name": "National Conference"}
        ],
        "divs": [
            {"did": 0, "cid": 0, "name": "East"},
            {"did": 1, "cid": 0, "name": "North"},
            {"did": 2, "cid": 0, "name": "South"},
            {"did": 3, "cid": 0, "name": "West"},
            {"did": 4, "cid": 1, "name": "East"},
            {"did": 5, "cid": 1, "name": "North"},
            {"did": 6, "cid": 1, "name": "South"},
            {"did": 7, "cid": 1, "name": "West"}
        ]`,
						hockey: `"confs": [
            {"cid": 0, "name": "Eastern Conference"},
            {"cid": 1, "name": "Western Conference"}
        ],
        "divs": [
            {"did": 0, "cid": 0, "name": "Atlantic"},
            {"did": 1, "cid": 0, "name": "Metropolitan"},
            {"did": 2, "cid": 1, "name": "Central"},
            {"did": 3, "cid": 1, "name": "Pacific"}
        ]`,
					},
					sport,
				)}
    }
}
</pre>
<p>
    <code>userTid</code> is the ID number of the team you are managing, from 0 to
    30. Setting it here will make it the default for new leagues created with this
    League File, but users can still change it if they want.
</p>
<p>
    <code>phase</code> is the "phase" of the game, set by one of the following
    numbers:
</p>
<ul>
    <li>0: preseason</li>
    <li>1: regular season</li>
    <li>2: regular season, after trade deadline</li>
    <li>3: playoffs</li>
    <li>4: before draft</li>
    <li>5: draft</li>
    <li>6: after draft</li>
    <li>7: re-sign players</li>
    <li>8: free agency</li>
</ul>
<p>
    So by setting the phase, you can pick when your game starts. So if you want to
    create a League File that starts with the draft, you can do it!
</p>
<p>
    <code>daysLeft</code> only has an effect if you set your phase to 8 (free
    agency). It defines the number of days left before the preseason starts.
</p>
<p>
    The values in <code>ownerMood</code> define how the owner feels about you.
    Positive numbers are good (max for each is 1), negative numbers are bad. If
    the sum ever drops below -1, you are fired.
</p>
<p>
    <code>numGamesPlayoffSeries</code> is an array containing the number of games
    in each round of playoffs. For instance, if you want the old NBA style of a 4
    round playoff where the first round is 5 games, set it to
    <code>[5, 7, 7, 7]</code>. This setting also determines the number of playoff
    teams, 2<sup>number of rounds</sup>. The default is 4 rounds (16 teams) with 7
    games each, but it will auto adjust to fewer rounds if you have fewer than 16
    teams.${
			sport === "basketball"
				? " Previously there was a setting called <code>numPlayoffRounds</code> that let you set the number of rounds - that    will continue to work as it did before, but    <code>numGamesPlayoffSeries</code> is the recommended way of changing the length of the playoffs now."
				: ""
		}
</p>
<p><a name="confs-divs"></a></p>
<h2>Conferences and Divisions</h2>
<p>
    The <code>confs</code> and <code>divs</code> properties let you change the
    conferences and divisions in the league. The default ones are shown above. You
    can have any number of conferences and divisions except 0. Things to remember:
</p>
<ol>
    <li>
        If you change the number of conferences or divisions, you must
        <a href="/${sport}/manual/customization/teams/">specify the teams</a> as well,
        otherwise the game won't know what teams to put in what division.
    </li>
    <li>
        The id properties <code>cid</code> and <code>did</code> must start at 0 and
        increase without gaps, same as <code>tid</code> for teams.
    </li>
    <li>
        If the number of conferences is something besides 2, then playoff seeding
        will be based on the top records in the entire league, because otherwise
        it's not clear how it would work (imagine a 16 team playoff picked from 3
        conferences).
    </li>
</ol>
<p>
    As an example, try
    <a href="/files/three_conferences.json"
        >this league file with 3 conferences and 12 teams</a
    >.
</p>
<h2>Confusing Season Stuff</h2>
<p>
    The last three attributes listed above are related to the season.
    <code>season</code> is the current season. <code>startingSeason</code> is the
    first season played in this league. <code>gracePeriodEnd</code> is the first
    season you can get fired after. If you set one of these, you should set all of
    them. You should also specify seasons for any stats, ratings, and attributes
    for your <a href="/${sport}/manual/customization/players/">players</a> and
    <a href="/${sport}/manual/customization/teams/">teams</a>.
</p>
<p>
    However, there is a shortcut to make things easier. Move
    <code>startingSeason</code> up to the root of the League File (at the same
    level as <code>gameAttributes</code>) and it will be used to automatically set
    all of the season variables everywhere. Or just leave
    <code>startingSeason</code> and all the other seasons out completely and the
    default value will be used.
</p>
<p><a name="player-names"></a></p>
<h2>Player Names, Countries, and Colleges</h2>
<p>
    By default, ${gameName} uses names, nationalities, and colleges similar to
    players in the ${proLeagueAbbrev}. All of this is customizable in league files.
    <a href="/${sport}/manual/customization/names-countries-colleges/"
        >Here is the documentation on customizing player names, countries, and
        colleges.</a
    >
</p>`;
	}
};
