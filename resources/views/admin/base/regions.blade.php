@foreach($regions as $region)
			  <tr>
				<td>{{$region->id}}</td>
				<td>{{$region->name}}</td>
				<td>{{$countries->where('id',$region->country_id)->first()->name}}</td>
				<td>
					<p class="text-center">
						<a class="btn btn-warning btn-xs" href="/admin/base/edit_region/{{$region->id}}">Редактировать</a>
					</p>
				</td>
			  </tr>
			@endforeach