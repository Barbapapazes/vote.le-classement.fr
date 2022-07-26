import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Association from 'App/Models/Association'
import Vote from 'App/Models/Vote'

export default class VotesController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const qs = request.qs()

    const votes = await Vote.filter(qs)
      .preload('association', (loader) => {
        loader.select('name', 'slug')
      })
      .paginate(page, limit)

    votes.baseUrl('/votes')
    votes.queryString(qs)

    const associations = await Association.query().select('name', 'id').orderBy('name', 'asc')

    return view.render('votes/index', {
      votes,
      associations: associations.map((s) => {
        return { value: s.id, label: s.name }
      }),
    })
  }

  public async checkEmail({ view }: HttpContextContract) {
    return view.render('vote/index', {
      title: 'Pense à valider ton vote',
      subtitle:
        "Merci d'avoir voté ! Tu vas recevoir d'ici quelques instants un mail pour valider ton vote.",
    })
  }

  public async validated({ view }: HttpContextContract) {
    return view.render('vote/index', {
      title: 'Ta voix a été prise en compte',
      subtitle:
        "Merci d'avoir voté. Tu peux continuer à suivre le Classement via ses réseaux si tu le souhaites !",
    })
  }

  public async invalidated({ view }: HttpContextContract) {
    return view.render('vote/index', {
      title: "Ce lien n'est pas valide",
      subtitle: 'Tu peux réessayer en retournant sur la page de ton association !',
    })
  }

  public async alreadyVoted({ view }: HttpContextContract) {
    return view.render('vote/index', {
      title: 'Tu as déjà voté pour cette association',
      subtitle: 'Mais tu peux continuer à suivre le Classement sur ses réseaux !',
    })
  }

  public async closed({ view }: HttpContextContract) {
    return view.render('vote/index', {
      title: 'Le vote est fermé',
      subtitle: "Désolé, il n'est pas possible de voter",
    })
  }

  public async limited({ view }: HttpContextContract) {
    return view.render('vote/index', {
      title: 'Tu ne peux plus essayer de voter',
      subtitle:
        "Si tu penses que c'est une erreur, tu peux changer de connexion internet (passer du Wifi à la 4G ou inversement). Sinon, reviens un peu plus tard !",
    })
  }
}
