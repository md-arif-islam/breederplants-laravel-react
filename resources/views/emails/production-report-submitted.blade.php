<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>{{ $notificationTitle }}</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #ffffff; margin: 0; padding: 0;" bgcolor="#f6f9fc">
    <table width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; padding: 0; border: 1px solid #e9e9e9;" bgcolor="#fff">
        <tr>
            <td style="box-sizing: border-box; vertical-align: top; padding: 20px;" valign="top">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding: 20px 0;">
                            <img src="https://portal.breederplants.nl/assets/frontend/imgs/theme/logo.png" alt="Breederplants Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="box-sizing: border-box; padding: 20px; border-radius: 3px; background-color: #f6f9fc; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);" bgcolor="#f6f9fc">
                            <h1 style="color: #45a049; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0 0 20px; font-size: 22px; font-weight: bold; text-align: center;">{{ $notificationTitle }}</h1>
                            <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0 0 20px; font-size: 14px; color: #000000;">{{ $greeting }}</p>
                            <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0 0 20px; font-size: 14px; color: #000000;">{{ $messageLine }}</p>
                            <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0 0 10px; font-size: 14px; color: #000000;">
                                Quarter: <strong>{{ $quarter }}</strong><br>
                                Year: <strong>{{ $year }}</strong><br>
                                Submission Date: <strong>{{ $submissionDate }}</strong>
                            </p>

                            <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; font-size: 14px; color: #000000;">
                                Best regards,<br>
                                The Breederplants Team
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; color: #666666; font-size: 12px; border-top: 1px solid #e9e9e9;">
                            © {{ date('Y') }} Breederplants. All Rights Reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
