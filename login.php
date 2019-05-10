<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>로그인</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                창업지원펀드
            </div>
            <nav>
                <ul>
                    <li><a href="#" class="active" data-target="list">펀드 보기</a></li>
                    <li><a href="#" data-target="register">펀드 등록</a></li>
                    <li><a href="#" data-target="investor">투자자 목록</a></li>
                </ul>

                <?php if(isset($_SESSION['user'])) : ?>
                    <div class="nav_btn">
                        <span><?= $_SESSION['user']->name ?>님 </span>
                        <span><?= $_SESSION['user']->money ?>원</span>
                        <a href="/logout.php" class="btn btn-red">로그아웃</a>
                    </div>
                <?php else : ?>
                <?php endif ?>
            </nav>
        </div>
    </header>

    <div class="wrapper">
        <div class="login_form">
            <h1>로그인</h1>
            <form action="login_ok.php" method="post">
                <div class="inputwindow">
                    <input type="text" name="id" placeholder="ID"><br>
                    <input type="password" name="password" placeholder="PASSWORD"><br>
                </div>

                <div class="buttonwindow">
                    <input type="submit" value="로그인">

                    <p>회원 가입을 원하시나요?</p>
                    <a href="/register.php" class="btn btn-red">회원가입</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>