@extends('admin.layout')

@section('content')

<form action="" method="post">
	<div id="settings-tab-areas">
		<table id="datatable" class="table table-bordered admin-users">
			<thead>
				<tr>
					<th class="col-id">Порядок</th>
					<th class="col-ava">Иконка</th>
					<th class="col-ava">Название</th>
					<th class="col-ava">Количество участников</th>
					<th class="col-ava">Действие</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1</td>
					<td class="text-center"><label for="updateIcon"><img src="http://orig15.deviantart.net/3ef6/f/2010/285/e/d/chicken_little_by_vale_ska-d30ncmy.gif" for="updateIcon"><input style="display: none;" id="updateIcon" type="file"></label></td>
					<td>Днепр</td>
					<td class="text-center">13</td>
					<td class="text-center">
						<input type="radio" name="radiobutton">
					</td>
				</tr>
				<tr>
					<td>3</td>
					<td class="text-center"><label for="updateIcon"><img src="http://orig15.deviantart.net/3ef6/f/2010/285/e/d/chicken_little_by_vale_ska-d30ncmy.gif" for="updateIcon"><input style="display: none;" id="updateIcon" type="file"></label></td>
					<td>Киев</td>
					<td class="text-center">14</td>
					<td class="text-center">
						<input type="radio" name="radiobutton">
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p class="mg-l"><input class="btn btn-primary" type="submit" value="Сохранить"></p>
</form>

@stop