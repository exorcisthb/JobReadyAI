export class HealthController {
  static check(_request, response) {
    response.status(200).send("OK");
  }
}
