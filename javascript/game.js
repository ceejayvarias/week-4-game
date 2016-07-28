var stats = {
// [attack power, HP, counterattack]
aang: {
	att: 7, 
	hp: 175, 
	ctr: 23
},
zuko: {
	att: 8, 
	hp: 220, 
	ctr: 9
},
katara: {
	att: 7, 
	hp: 180, 
	ctr: 25
},
toph: {
	att: 15, 
	hp: 165, 
	ctr: 12
}
};
var aStats;
var dStats;
var attackerSelect = true;
var defenderSelect = true;
var battleReady = false;
var acharID = ''; // attcker character ID
var dcharID = ''; //defender character ID
var multiplier = 1; //gain attack power for every attack

//function that displays the characters
var str; // generic string
var int; // generic integer
var wins = 0; //keeps track of wins
var array = Object.keys(stats); //how many enemies to face

//sets inital HP
function setHP(str){
	var strID = '#' + str + '> .hp ';
	if (attackerSelect) {
		$(strID).html(stats[str].hp);
	}
	else{
		$('#attacker > .characters > .hp').html(aStats.hp);
		$('#defender > .characters > .hp').html(dStats.hp);
	}
}

$.each(stats, function(key){
	setHP(key);
});

//selects the character and gives it stats
function charSelect(str){
	if(attackerSelect){
		aStats = stats[str];
	}
	else{
		if(defenderSelect){
			dStats = stats[str];
		}
	}
}

//restart button to refresh page
function restart(str){
	var restartButton = '<button id="restart">' + str + '</button>';
	$('#messages').append(restartButton);
	$('#restart').click(function() {
    	location.reload(true);
	});
}

//function that initiates the attack
function battlePhase(){
	if (battleReady) {
		aStats.hp = aStats.hp - dStats.ctr;
		dStats.hp = dStats.hp - aStats.att*multiplier;
		var displayD = dcharID.substr(0,1).toUpperCase()+dcharID.substr(1);
		$('#messages > p').html('You attacked ' + displayD + ' for ' + aStats.att*multiplier + ' damage. <br>' + displayD + ' attacked you for ' + dStats.ctr + ' damage.');
		multiplier++;
		setHP(acharID);
		setHP(dcharID);
		if(aStats.hp <= 0){
			$('#messages > p').html('You have been... DEFEATED!');
			restart('Try again?');
			battleReady = false;

		}
		else if(dStats.hp <= 0){
			$('#' + dcharID).remove();
			wins++;
				if (wins == array.length - 1) {
					$('#messages > p').html('You win!');
					restart('Play again?');
					defenderSelect = false;
				}
				else{					
					$('#messages > p').html('You have defeated ' + displayD + ', you can choose another enemy to fight.');
					defenderSelect = true;
				}
			battleReady = false;
		}
	}
	else{

	}	
}

$(document).ready(function (){
	$('#messages > p').html('Please choose your bender.');
// clicking images move them to certain sections and sets up character stats
	$('.characters').click( function (){
		if(attackerSelect){
			$('#attacker').append($(this));
			acharID = $(this).attr('id');
			charSelect(acharID);
			attackerSelect = false;
			$('#enemies').append($('#main-container'));
			$('#messages > p').html('Choose an enemy.');
			$('#main-container > h1').remove();
		}
		else{
			// lets you select defender without selecting the same attacker
			if(defenderSelect && acharID != $(this).attr('id')){
				$('#defender').append($(this));
				dcharID = $(this).attr('id');
				charSelect(dcharID);
				battleReady = true;
				defenderSelect = false;
				$('#messages > p').html('Now click fight!');
			}
		}
	});

	$('#fight').click( function(){
		if(!defenderSelect){
			battlePhase();
		}
		else if(defenderSelect){
			$('#messages > p').html('No enemy here.');
		}
	});

});
