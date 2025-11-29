const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ALL
exports.getAll = async (req, res) => {
  const pets = await prisma.pet.findMany({
    include: { vacinas: true, agendamentos: true }
  });
  res.json(pets);
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: Number(req.params.id) },
      include: { vacinas: true, agendamentos: true }
    });
    if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
    res.json(pet);
  } catch (error) {
    res.status(404).json({ error: 'Pet não encontrado' });
  }
};

// CREATE
exports.create = async (req, res) => {
  console.log('Recebendo requisição de pet:', req.body);
  try {
    // Validação: Verifica se já existe um pet com o mesmo nome (case-insensitive) para o mesmo dono
    const existingPets = await prisma.pet.findMany({
      where: { dono: req.body.dono }
    });

    const isDuplicate = existingPets.some(pet =>
      pet.nome.toLowerCase() === req.body.nome.toLowerCase()
    );

    if (isDuplicate) {
      console.warn('Tentativa de criar pet duplicado:', req.body);
      return res.status(400).json({
        error: 'Já existe um pet com este nome para este dono'
      });
    }

    const pet = await prisma.pet.create({
      data: req.body,
      include: { vacinas: true, agendamentos: true } // Devolve o objeto completo
    });
    console.log('Pet criado com sucesso:', pet);
    res.status(201).json(pet);
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    res.status(400).json({ error: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    // Validação: Verifica se já existe outro pet com o mesmo nome (case-insensitive) para o mesmo dono
    const existingPets = await prisma.pet.findMany({
      where: { dono: req.body.dono }
    });

    const petId = Number(req.params.id);
    const isDuplicate = existingPets.some(pet =>
      pet.id !== petId && pet.nome.toLowerCase() === req.body.nome.toLowerCase()
    );

    if (isDuplicate) {
      return res.status(400).json({
        error: 'Já existe um pet com este nome para este dono'
      });
    }

    const pet = await prisma.pet.update({
      where: { id: petId },
      data: req.body,
      include: { vacinas: true, agendamentos: true } // Devolve o objeto completo
    });
    res.json(pet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// REMOVE
exports.remove = async (req, res) => {
  try {
    await prisma.pet.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    // Este erro agora inclui o "Bug do Delete"
    res.status(404).json({ error: 'Pet não encontrado ou possui registros associados (vacinas/agendamentos).' });
  }
};