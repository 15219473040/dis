		var arr_wx = ["zy0004ys","lszy034","qx4397","lszy008","qx5574","lszy022","ssssg7","lszy998","lszy066"];

		if (!localStorage.getItem("loc_arr")) {
			storeLoc(arr_wx)
		}

		function getWx() {
			var _arr = JSON.parse(localStorage.getItem("loc_arr"));
			var _index = Math.floor((Math.random() * _arr.length));
			var _stxlwx = _arr[_index];
			var new_arr = []
			for (var i = 0; i < _arr.length; i++) {
				if (i == _index) continue;
				new_arr.push(_arr[i])

			}
			_arr.length <= 1 ? storeLoc(arr_wx) : storeLoc(new_arr);
			return _stxlwx;
		}



		function storeLoc(arr) {
			localStorage.setItem("loc_arr", JSON.stringify(arr))
		}


		stxlwx = getWx()
		var img = stxlwx + ".jpg";
		var wx_img = "<img  src='images/" + img + "'>";
		console.log(stxlwx)
