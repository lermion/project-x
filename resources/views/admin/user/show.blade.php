<style>
    table {
        width: 100%;
        border: 4px solid black;
        border-collapse: collapse;
    }

    th {
        text-align: center;
        background: #ccc;
        padding: 5px;
        border: 1px solid black;
    }

    td {
        text-align: center;
        padding: 5px;
        border: 1px solid black;
    }
</style>
<table>
    <thead>
    <tr>
        <th>id</th>
        <th>Аватар</th>
        <th>Имя</th>
        <th>Логин</th>
        <th>Телефон</th>
        <th>Пол</th>
        <th>Возраст</th>
        <th>Дата регистрации</th>
        <th>Статус</th>
        <th>Действия</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>{{ $user->id }}</td>
        <td><img style="height: 70px" src="/images/user.png"></td>
        <td>{{ $user->first_name }} {{ $user->last_name }}</td>
        <td>{{ $user->login }}</td>
        <td>{{ $user->phone }}</td>
        <td>{{ $user->gender }}</td>
        <td>{{ $user->birthday=='0000-00-00' ? '---' : date_diff(new DateTime($user->birthday), new DateTime())->y }}</td>
        <td>{{ $user->created_at }}</td>
        <td>{{ $user->status }}</td>
        <td>
            <button>Подтвердить</button>
            <br>
            <button>На заметку</button>
            <br>
            <button>Подозрительный</button>
            <br>
            <button>Удалить</button>
            <br>
        </td>
    </tr>
    </tbody>
</table>