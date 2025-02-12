import enrollmentReducerFactory from './enrollmentReducer';

describe('enrollmentReducerFactory', () => {
  const previousEnrollment = {
    acl: {
      update: true,
      submit: true,
    },
    status: 'draft',
    target_api: 'api_particulier',
    scopes: {
      dgfip_declarant1_nom: false,
      cnaf_quotient_familial: false,
    },
    team_members: [
      {
        type: 'demandeur',
        tmp_id: 'tmp_31',
        email: 'datapass@yopmail.com',
      },
      {
        type: 'responsable_technique',
        tmp_id: 'tmp_34',
      },
    ],
  };
  describe('enrollmentReducer with no demarches', () => {
    const enrollmentReducer = enrollmentReducerFactory(null);

    it('should return previous enrollment if second argument is not an object', () => {
      expect(enrollmentReducer(previousEnrollment, 'not_an_object')).toEqual(
        previousEnrollment
      );
    });

    it('should return updated enrollment when second argument is an event from input text', () => {
      const newIntitule =
        'Calcul de la tarification pour la facturation des services périscolaires';
      const event = {
        currentTarget: null,
        target: {
          accept: '',
          checked: false,
          name: 'intitule',
          type: 'text',
          value: newIntitule,
        },
      };

      expect(enrollmentReducer(previousEnrollment, event).intitule).toEqual(
        newIntitule
      );
    });

    it('should return updated enrollment when second argument is an event from checkbox', () => {
      const event = {
        currentTarget: null,
        target: {
          accept: '',
          checked: true,
          name: 'scopes.dgfip_declarant1_nom',
          type: 'checkbox',
          value: 'on',
        },
      };

      expect(
        enrollmentReducer(previousEnrollment, event).scopes.dgfip_declarant1_nom
      ).toEqual(true);
    });

    it('should return updated enrollment when second argument is an event from input text in nested object', () => {
      const newEmail = 'tech@yopmail.com';
      const event = {
        currentTarget: null,
        target: {
          accept: '',
          checked: false,
          name: 'team_members[1].email',
          type: 'email',
          value: newEmail,
        },
      };

      // we clone the previousEnrollment as updating a collection mutate the collection in the original enrollment
      expect(enrollmentReducer(previousEnrollment, event).team_members).toEqual(
        [
          {
            type: 'demandeur',
            tmp_id: 'tmp_31',
            email: 'datapass@yopmail.com',
          },
          {
            type: 'responsable_technique',
            tmp_id: 'tmp_34',
            email: newEmail,
          },
        ]
      );
    });

    it('should return updated enrollment when second argument is not an event', () => {
      const savedEnrollment = {
        acl: {
          update: true,
          submit: true,
          show: true,
          create: true,
          destroy: true,
          notify: false,
          get_email_templates: true,
          copy: false,
          validate: false,
          request_changes: false,
          refuse: false,
          index: false,
        },
        cgu_approved: null,
        demarches: null,
        status: 'pending',
        target_api: 'api_particulier',
        scopes: {
          dgfip_declarant1_nom: false,
          cnaf_quotient_familial: false,
        },
        updated_at: '2021-11-02T10:25:15.468Z',
        created_at: '2021-11-02T10:25:15.468Z',
        id: 1058510693,
        team_members: [
          {
            id: 525,
            type: 'demandeur',
            email: 'datapass@yopmail.com',
          },
          {
            id: 528,
            type: 'responsable_technique',
            email: null,
          },
        ],
        intitule:
          'Calcul de la tarification pour la facturation des services périscolaires',
      };

      const newEnrollment = { ...savedEnrollment };
      delete newEnrollment.demarches;
      delete newEnrollment.cgu_approved;
      newEnrollment.team_members = [
        {
          id: 525,
          type: 'demandeur',
          email: 'datapass@yopmail.com',
          tmp_id: 'tmp_31',
        },
        {
          id: 528,
          type: 'responsable_technique',
          email: null,
          tmp_id: 'tmp_34',
        },
      ];

      expect(enrollmentReducer(previousEnrollment, savedEnrollment)).toEqual(
        newEnrollment
      );
    });
  });

  describe('enrollmentReducer with demarches', function () {
    const demarches = {
      default: {
        state: {
          intitule: '',
          scopes: {
            dgfip_declarant1_nom: false,
            cnaf_quotient_familial: false,
          },
        },
        team_members: {
          responsable_technique: {
            email: '',
          },
        },
      },
      editeur: {
        state: {
          intitule:
            'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.',
          scopes: {
            cnaf_quotient_familial: true,
          },
        },
        team_members: {
          responsable_technique: {
            email: 'technique@editeur.fr',
          },
        },
      },
      editeur_without_resp_tech: {
        state: {
          intitule:
            'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.',
          scopes: {
            cnaf_quotient_familial: true,
          },
        },
      },
    };

    const enrollmentReducer = enrollmentReducerFactory(demarches);

    describe('when a demarche is selected', () => {
      const event = {
        currentTarget: null,
        target: {
          name: 'demarche',
          value: 'editeur',
        },
      };
      it('should return an updated intitule', () => {
        expect(enrollmentReducer(previousEnrollment, event).intitule).toEqual(
          'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.'
        );
      });
      it('should return updated objects', () => {
        expect(enrollmentReducer(previousEnrollment, event).scopes).toEqual({
          dgfip_declarant1_nom: false,
          cnaf_quotient_familial: true,
        });
      });
      it('should return updated collections', () => {
        expect(
          enrollmentReducer(previousEnrollment, event).team_members
        ).toEqual([
          {
            type: 'demandeur',
            email: 'datapass@yopmail.com',
            tmp_id: 'tmp_31',
          },
          {
            type: 'responsable_technique',
            email: 'technique@editeur.fr',
            tmp_id: 'tmp_34',
          },
        ]);
      });
    });

    describe('when a demarche with no team_member is selected', () => {
      const event = {
        currentTarget: null,
        target: {
          name: 'demarche',
          value: 'editeur_without_resp_tech',
        },
      };
      it('should return the default collection', () => {
        expect(
          enrollmentReducer(previousEnrollment, event).team_members
        ).toEqual([
          {
            type: 'demandeur',
            email: 'datapass@yopmail.com',
            tmp_id: 'tmp_31',
          },
          {
            type: 'responsable_technique',
            email: '',
            tmp_id: 'tmp_34',
          },
        ]);
      });
    });

    describe('when a demarche is selected on a uninitialized enrollment', () => {
      const event = {
        currentTarget: null,
        target: {
          name: 'demarche',
          value: 'editeur',
        },
      };
      it('should return an updated intitule', () => {
        expect(enrollmentReducer({}, event).intitule).toEqual(
          'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.'
        );
      });
      it('should return an empty collections', () => {
        expect(enrollmentReducer({}, event).team_members).toEqual(undefined);
      });
    });

    describe('when two demarches are selected successively', () => {
      const event1 = {
        currentTarget: null,
        target: {
          name: 'demarche',
          value: 'editeur',
        },
      };
      const event2 = {
        currentTarget: null,
        target: {
          name: 'demarche',
          value: 'editeur_without_resp_tech',
        },
      };
      it('should return the default collection', () => {
        expect(
          enrollmentReducer(
            enrollmentReducer(previousEnrollment, event1),
            event2
          ).team_members
        ).toEqual([
          {
            type: 'demandeur',
            email: 'datapass@yopmail.com',
            tmp_id: 'tmp_31',
          },
          {
            type: 'responsable_technique',
            email: '',
            tmp_id: 'tmp_34',
          },
        ]);
      });
    });
  });
});
