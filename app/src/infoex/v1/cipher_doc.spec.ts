import { expect } from "chai";
import { webcrypto } from 'crypto';
import { describe } from "mocha";
import { decryptInfoCipherDoc, encryptInfoDoc, InfoCipherDoc, InfoDoc, NoKeyFoundError } from "./cipher_doc";
import { RSAEncrypter } from "./encryption";

const allowedPhrases = [
	"cruel verify defy trust mansion catch avoid enhance valid giraffe scare possible cricket useless interest",
	"clean acid dirt develop rotate spatial cousin slender rare snap pelican travel roof rent focus",
	"confirm sick void pluck flat citizen crumble piece clinic photo avoid express birth protect net"
];

const notAllowedPhrases = [
	"lazy bracket found polar utility judge flavor solution climb gentle prefer know brush fiscal board",
	"wrestle champion cotton cabbage bonus try birth eternal float color evidence behave essay riot hockey"
];

describe("Group Encryption", async () => {

	it("all in group should be able to decrypt, none out of group can", async () => {
		const allowedEncrypters = await Promise.all(allowedPhrases.map(phrase => RSAEncrypter.create(webcrypto as any, phrase)));
		const notAllowedEncrypters = await Promise.all(notAllowedPhrases.map(phrase => RSAEncrypter.create(webcrypto as any, phrase)));

		const infoDoc: InfoDoc = {
			accounts: [
				{
					address: "0x123",
				},
				{
					address: "0x456",
				},
				{
					address: "0x789",
				}
			]
		};

		const ownerEncrypter = allowedEncrypters[0];

		// Encrypt infoDoc with ownerEncrypter for allowed encrypters.
		console.log(`encrypting infoDoc`);
		const cipherDoc: InfoCipherDoc = await encryptInfoDoc(
			webcrypto as any,
			await Promise.all(allowedEncrypters.map(e => e.exportPublicKey())),
			ownerEncrypter,
			infoDoc
		);

		// Serialize & deserialize cipherDoc.
		const cipherDocJson = JSON.stringify(cipherDoc);
		const cipherDoc2 = JSON.parse(cipherDocJson);

		// Verify that each allowed encrypter can decrypt cipherDoc.
		await Promise.all(allowedEncrypters.map(async encrypter => {
			console.log(`decrypting with allowed encrypter #${allowedEncrypters.indexOf(encrypter)}`);

			const decryptedDoc = await decryptInfoCipherDoc(
				webcrypto as any,
				encrypter,
				cipherDoc2
			);

			console.log(`decryptedDoc: ${JSON.stringify(decryptedDoc)}`);

			expect(decryptedDoc).to.deep.equal(infoDoc);
		}));

		// Verify that each notAllowed encrypter cannot decrypt cipherDoc (throws NoKeyFoundError).
		await Promise.all(notAllowedEncrypters.map(async encrypter => {
			console.log(`decrypting with notAllowed encrypter #${notAllowedEncrypters.indexOf(encrypter)}`);
			let error: any;

			try {
				await decryptInfoCipherDoc(
					webcrypto as any,
					encrypter,
					cipherDoc2
				);
			} catch (e) {
				error = e;
			}

			expect(error).to.be.instanceof(NoKeyFoundError);
		}));

	});
});
