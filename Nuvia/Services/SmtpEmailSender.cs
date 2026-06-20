using Microsoft.Extensions.Options;
using Nuvia.Settings;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace Nuvia.Services
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly SmtpSettings _settings;

        public SmtpEmailSender(IOptions<SmtpSettings> settings)
        {
            _settings = settings.Value;
        }

        public SmtpEmailSender(SmtpSettings settings)
        {
            _settings = settings;
        }

        private string Host => _settings.Host;
        private int Port => _settings.Port;
        private bool EnableSsl => _settings.EnableSsl;
        private string User => _settings.User;
        private string Password => _settings.Password;
        private string FromDisplay => _settings.From ?? _settings.User;
        
        public async Task SendMagicLinkAsync(string toEmail, string magicLinkUrl, string? userName)
        {
            var name = string.IsNullOrWhiteSpace(userName) ? toEmail : userName;
            var subject = "Tu enlace mágico de acceso a Nuvia";

            var html = BuildMagicLinkHtml(name, magicLinkUrl);
            var plain = BuildMagicLinkPlain(name, magicLinkUrl);

            await SendEmailInternalAsync(toEmail, subject, html, plain);
        }

        public async Task SendBookingConfirmationAsync(
            string toEmail,
            string userName,
            string bookingCode,
            DateTime bookingDate,
            decimal total)
        {
            var subject = $"Tu reserva en Nuvia ({bookingCode})";

            var html = BuildBookingConfirmationHtml(userName, bookingCode, bookingDate, total);
            var plain = BuildBookingConfirmationPlain(userName, bookingCode, bookingDate, total);

            await SendEmailInternalAsync(toEmail, subject, html, plain);
        }

        public async Task SendPaymentReceiptAsync(
            string toEmail,
            string userName,
            string bookingCode,
            int paymentId,
            decimal amount,
            DateTime paidAt)
        {
            var subject = $"Recibo de pago Nuvia #{paymentId}";

            var html = BuildPaymentReceiptHtml(userName, bookingCode, paymentId, amount, paidAt);
            var plain = BuildPaymentReceiptPlain(userName, bookingCode, paymentId, amount, paidAt);

            await SendEmailInternalAsync(toEmail, subject, html, plain);
        }

        private async Task SendEmailInternalAsync(
    string toEmail,
    string subject,
    string htmlBody,
    string plainTextBody)
        {
            if (string.IsNullOrWhiteSpace(Host))
                throw new InvalidOperationException("SMTP host no está configurado.");

            using var client = new SmtpClient(Host, Port)
            {
                EnableSsl = EnableSsl,
                Credentials = new NetworkCredential(User, Password),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Timeout = 10000
            };

            using var message = new MailMessage
            {
                From = new MailAddress(FromDisplay, "Nuvia"),
                Subject = subject,
                Body = string.Empty,
                IsBodyHtml = false
            };

            message.To.Add(toEmail);

            // Vista de texto plano
            var plainView = AlternateView.CreateAlternateViewFromString(
                plainTextBody,
                null,
                "text/plain");

            // Vista HTML
            var htmlView = AlternateView.CreateAlternateViewFromString(
                htmlBody,
                null,
                "text/html");

            message.AlternateViews.Add(plainView);
            message.AlternateViews.Add(htmlView);

            await client.SendMailAsync(message);
        }


        private string BuildMagicLinkHtml(string userName, string link)
        {
            var safeName = System.Net.WebUtility.HtmlEncode(userName);
            var safeLink = System.Net.WebUtility.HtmlEncode(link);

            var sb = new StringBuilder();

            sb.Append($@"
<!DOCTYPE html>
<html lang=""es"">
<head>
  <meta charset=""UTF-8"" />
  <title>Acceso a Nuvia</title>
</head>
<body style=""margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"">
  <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#f4f4f5;padding:24px 0;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);"">
          <tr>
            <td style=""background:linear-gradient(135deg,#4f46e5,#ec4899);padding:16px 24px;color:#ffffff;text-align:center;"">
              <h1 style=""margin:0;font-size:20px;font-weight:600;"">Bienvenido a Nuvia</h1>
              <p style=""margin:4px 0 0;font-size:13px;opacity:0.9;"">
                Sistema de gestión de reservas turísticas
              </p>
            </td>
          </tr>

          <tr>
            <td style=""padding:24px 24px 8px 24px;color:#111827;font-size:14px;"">
              <p style=""margin:0 0 12px 0;"">Hola <strong>{safeName}</strong>,</p>
              <p style=""margin:0 0 12px 0;"">
                Has solicitado acceder a tu cuenta en Nuvia mediante un enlace mágico.
              </p>
              <p style=""margin:0 0 12px 0;"">
                Haz clic en el siguiente botón para iniciar sesión de forma segura:
              </p>
            </td>
          </tr>

          <tr>
            <td style=""padding:0 24px 16px 24px;"">
              <table cellpadding=""0"" cellspacing=""0"" style=""margin:20px auto;"">
                <tr>
                  <td align=""center""
                      style=""background-color:#5e5bd9; border-radius:6px; padding:12px 24px;"">
                    <a href=""{link}""
                       style=""color:#ffffff; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;"">
                      Acceder a mi cuenta
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style=""padding:0 24px 16px 24px;color:#6b7280;font-size:12px;"">
              <p style=""margin:0 0 8px 0;"">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style=""margin:0 0 12px 0;word-break:break-all;color:#4f46e5;"">
                {safeLink}
              </p>
              <p style=""margin:0;"">
                Por seguridad, este enlace es válido solo por unos minutos
                y se puede usar una única vez.
              </p>
            </td>
          </tr>

          <tr>
            <td style=""padding:12px 24px 16px 24px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;text-align:center;"">
              <p style=""margin:0;"">
                Nuvia &bull; Plataforma de reservas turísticas
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>");

            return sb.ToString();
        }

        private string BuildMagicLinkPlain(string userName, string link)
        {
            return $@"Hola {userName},

Has solicitado acceder a tu cuenta en Nuvia.

Usa este enlace para iniciar sesión:
{link}

Si no fuiste tú, puedes ignorar este correo.";
        }

        private string BuildBookingConfirmationHtml(
            string userName,
            string bookingCode,
            DateTime bookingDate,
            decimal total)
        {
            var safeName = System.Net.WebUtility.HtmlEncode(userName);
            var dateText = bookingDate.ToString("dd/MM/yyyy HH:mm");

            return $@"
<!DOCTYPE html>
<html lang=""es"">
<head>
  <meta charset=""UTF-8"">
  <title>Confirmación de reserva</title>
</head>
<body style=""margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"">
  <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#f4f4f5;padding:24px 0;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);"">
          <tr>
            <td style=""background:linear-gradient(135deg,#22c55e,#0ea5e9);padding:16px 24px;color:#ffffff;text-align:center;"">
              <h1 style=""margin:0;font-size:20px;font-weight:600;"">¡Tu reserva está creada!</h1>
              <p style=""margin:4px 0 0;font-size:13px;opacity:0.9;"">
                Código de reserva: <strong>{bookingCode}</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style=""padding:24px;color:#111827;font-size:14px;"">
              <p style=""margin:0 0 12px 0;"">Hola <strong>{safeName}</strong>,</p>
              <p style=""margin:0 0 12px 0;"">
                Hemos creado tu reserva en Nuvia. Aquí tienes un resumen:
              </p>

              <table cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""border-collapse:collapse;margin:12px 0 16px 0;font-size:13px;"">
                <tr>
                  <td style=""padding:6px 0;color:#6b7280;"">Fecha de creación:</td>
                  <td style=""padding:6px 0;color:#111827;text-align:right;"">{dateText}</td>
                </tr>
                <tr>
                  <td style=""padding:6px 0;color:#6b7280;"">Código de reserva:</td>
                  <td style=""padding:6px 0;color:#111827;text-align:right;font-weight:600;"">{bookingCode}</td>
                </tr>
                <tr>
                  <td style=""padding:6px 0;color:#6b7280;"">Total:</td>
                  <td style=""padding:6px 0;color:#111827;text-align:right;font-weight:600;"">${total:N2} USD</td>
                </tr>
              </table>

              <p style=""margin:0 0 12px 0;"">
                Recibirás otro correo cuando tu pago sea confirmado.
              </p>
            </td>
          </tr>

          <tr>
            <td style=""padding:12px 24px 16px 24px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;text-align:center;"">
              <p style=""margin:0;"">
                Gracias por reservar con Nuvia.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
        }

        private string BuildBookingConfirmationPlain(
            string userName,
            string bookingCode,
            DateTime bookingDate,
            decimal total)
        {
            return $@"Hola {userName},

Tu reserva en Nuvia ha sido creada.

Código de reserva: {bookingCode}
Fecha: {bookingDate:dd/MM/yyyy HH:mm}
Total: {total:N2} USD

Recibirás otro correo cuando tu pago sea confirmado.";
        }

        private string BuildPaymentReceiptHtml(
            string userName,
            string bookingCode,
            int paymentId,
            decimal amount,
            DateTime paidAt)
        {
            var safeName = System.Net.WebUtility.HtmlEncode(userName);
            var dateText = paidAt.ToString("dd/MM/yyyy HH:mm");

            return $@"
<!DOCTYPE html>
<html lang=""es"">
<head>
  <meta charset=""UTF-8"">
  <title>Recibo de pago</title>
</head>
<body style=""margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"">
  <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#f4f4f5;padding:24px 0;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);"">
          <tr>
            <td style=""background:linear-gradient(135deg,#4f46e5,#22c55e);padding:16px 24px;color:#ffffff;text-align:center;"">
              <h1 style=""margin:0;font-size:20px;font-weight:600;"">Pago confirmado</h1>
              <p style=""margin:4px 0 0;font-size:13px;opacity:0.9;"">
                Recibo #{paymentId}
              </p>
            </td>
          </tr>

          <tr>
            <td style=""padding:24px;color:#111827;font-size:14px;"">
              <p style=""margin:0 0 12px 0;"">
                Hola <strong>{safeName}</strong>,
              </p>
              <p style=""margin:0 0 12px 0;"">
                Hemos recibido tu pago correctamente. Aquí tienes el resumen de tu recibo:
              </p>

              <table cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""border-collapse:collapse;margin:12px 0 16px 0;font-size:13px;"">
                <tr>
                  <td style=""padding:6px 0;color:#6b7280;"">Código de reserva:</td>
                  <td style=""padding:6px 0;color:#111827;text-align:right;font-weight:600;"">{bookingCode}</td>
                </tr>
                <tr>
                  <td style=""padding:6px 0;color:#6b7280;"">Fecha de pago:</td>
                  <td style=""padding:6px 0;color:#111827;text-align:right;"">{dateText}</td>
                </tr>
                <tr>
                  <td style=""padding:6px 0;color:#6b7280;"">Monto pagado:</td>
                  <td style=""padding:6px 0;color:#111827;text-align:right;font-weight:600;"">${amount:N2} USD</td>
                </tr>
              </table>

              <p style=""margin:0 0 12px 0;"">
                Gracias por confiar en Nuvia para tus viajes.
              </p>
            </td>
          </tr>

          <tr>
            <td style=""padding:12px 24px 16px 24px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;text-align:center;"">
              <p style=""margin:0;"">
                Este correo sirve como comprobante de pago.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
        }

        private string BuildPaymentReceiptPlain(
            string userName,
            string bookingCode,
            int paymentId,
            decimal amount,
            DateTime paidAt)
        {
            return $@"Hola {userName},

Tu pago ha sido confirmado.

Código de reserva: {bookingCode}
Recibo: {paymentId}
Monto pagado: {amount:N2} USD
Fecha de pago: {paidAt:dd/MM/yyyy HH:mm}

Gracias por reservar con Nuvia.
";
        }
    }
}
