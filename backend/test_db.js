const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('Iniciando teste de conexão com o banco de dados...');

    const prisma = new PrismaClient();

    try {
        console.log('Tentando conectar...');
        await prisma.$connect();
        console.log('Conexão estabelecida com sucesso!');

        console.log('Tentando buscar pets...');
        const pets = await prisma.pet.findMany();
        console.log(`Encontrados ${pets.length} pets.`);

        console.log('Tentando criar um pet de teste...');
        const novoPet = await prisma.pet.create({
            data: {
                nome: 'TesteDB_' + Date.now(),
                dono: 'Sistema de Teste',
                idade: 5,
                raca: 'Vira-lata'
            }
        });
        console.log('Pet de teste criado:', novoPet);

        console.log('Tentando excluir o pet de teste...');
        await prisma.pet.delete({
            where: { id: novoPet.id }
        });
        console.log('Pet de teste excluído com sucesso.');

        console.log('TESTE CONCLUÍDO COM SUCESSO!');

    } catch (e) {
        console.error('ERRO DURANTE O TESTE:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
