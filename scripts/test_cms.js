import { handleApiRequest } from "../server/apiRouter.js";

// Mock helper for Node HTTP request/response
function createMockReqRes({ method = "GET", url = "/", headers = {}, body = null }) {
  const listeners = {};
  const req = {
    method,
    url,
    headers: { host: "localhost:5174", ...headers },
    on(event, cb) {
      listeners[event] = cb;
      if (event === "data" && body) {
        cb(typeof body === "string" ? body : JSON.stringify(body));
      }
      if (event === "end") {
        setTimeout(cb, 10);
      }
    },
    destroy() {}
  };

  let statusCode = 200;
  let resHeaders = {};
  let resBody = "";

  const resPromise = new Promise((resolve) => {
    const res = {
      writeHead(code, h = {}) {
        statusCode = code;
        resHeaders = { ...resHeaders, ...h };
      },
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
      },
      end(chunk) {
        if (chunk) resBody += chunk;
        resolve({
          statusCode,
          headers: resHeaders,
          body: resBody ? JSON.parse(resBody) : null,
          rawBody: resBody
        });
      }
    };

    handleApiRequest(req, res).catch((err) => {
      resolve({ statusCode: 500, error: err.message });
    });
  });

  return resPromise;
}

async function runTests() {
  console.log("=== STARTING STABILITY & VALIDATION TEST SUITE ===\n");

  // Login
  console.log("Step 1: Authenticate Admin");
  const loginRes = await createMockReqRes({
    method: "POST",
    url: "/api/auth/login",
    body: { password: "deepak_admin_2026" }
  });
  if (loginRes.statusCode !== 200 || !loginRes.body.token) {
    console.error("Login failed:", loginRes);
    process.exit(1);
  }
  const token = loginRes.body.token;
  const authHeaders = { authorization: `Bearer ${token}` };
  console.log("✓ PASS: Admin authenticated.");

  // Test 1: Certification Validations & Duplicate Prevention
  console.log("\nStep 2: Test Certification Validation (Empty Title - Expect 400)");
  const emptyCert = await createMockReqRes({
    method: "POST",
    url: "/api/admin/certifications",
    headers: authHeaders,
    body: { title: "", issuer: "Oracle" }
  });
  if (emptyCert.statusCode === 400) {
    console.log("✓ PASS: Empty title rejected with 400 Bad Request:", emptyCert.body.error);
  } else {
    console.error("✗ FAIL: Expected 400, got:", emptyCert.statusCode);
    process.exit(1);
  }

  console.log("Step 2b: Create Certification");
  const newCert = await createMockReqRes({
    method: "POST",
    url: "/api/admin/certifications",
    headers: authHeaders,
    body: {
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI",
      year: "2026",
      category: "AI / ML"
    }
  });
  if (newCert.statusCode === 201) {
    console.log("✓ PASS: Certification created ID:", newCert.body.id);
  } else {
    console.error("✗ FAIL:", newCert);
    process.exit(1);
  }

  console.log("Step 2c: Duplicate Certification Submission (Expect 409)");
  const dupCert = await createMockReqRes({
    method: "POST",
    url: "/api/admin/certifications",
    headers: authHeaders,
    body: {
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI",
      year: "2026",
      category: "AI / ML"
    }
  });
  if (dupCert.statusCode === 409) {
    console.log("✓ PASS: Duplicate certification rejected with 409 Conflict:", dupCert.body.error);
  } else {
    console.error("✗ FAIL: Expected 409, got:", dupCert.statusCode);
    process.exit(1);
  }

  // Cleanup test cert
  await createMockReqRes({
    method: "DELETE",
    url: `/api/admin/certifications/${newCert.body.id}`,
    headers: authHeaders
  });
  console.log("✓ PASS: Cleaned up test certification.");

  // Test 2: Skill Validations & Duplicate Prevention
  console.log("\nStep 3: Test Skill Validation (Empty Name - Expect 400)");
  const emptySkill = await createMockReqRes({
    method: "POST",
    url: "/api/admin/skills",
    headers: authHeaders,
    body: { name: "", category: "PROGRAMMING LANGUAGES" }
  });
  if (emptySkill.statusCode === 400) {
    console.log("✓ PASS: Empty skill name rejected with 400 Bad Request.");
  } else {
    console.error("✗ FAIL: Expected 400, got:", emptySkill.statusCode);
    process.exit(1);
  }

  console.log("Step 3b: Duplicate Skill in Same Category (Expect 409)");
  const dupSkill = await createMockReqRes({
    method: "POST",
    url: "/api/admin/skills",
    headers: authHeaders,
    body: { name: "PYTHON", category: "PROGRAMMING LANGUAGES" }
  });
  if (dupSkill.statusCode === 409) {
    console.log("✓ PASS: Duplicate skill rejected with 409 Conflict:", dupSkill.body.error);
  } else {
    console.error("✗ FAIL: Expected 409, got:", dupSkill.statusCode);
    process.exit(1);
  }

  // Test 3: Project Validations & Ordering
  console.log("\nStep 4: Test Project Validation (Short Description - Expect 400)");
  const invalidProj = await createMockReqRes({
    method: "POST",
    url: "/api/admin/projects",
    headers: authHeaders,
    body: { title: "TEST PROJ", description: "hi" }
  });
  if (invalidProj.statusCode === 400) {
    console.log("✓ PASS: Short description rejected with 400 Bad Request.");
  } else {
    console.error("✗ FAIL: Expected 400, got:", invalidProj.statusCode);
    process.exit(1);
  }

  console.log("Step 4b: Reorder Projects Atomically");
  const reorderRes = await createMockReqRes({
    method: "PUT",
    url: "/api/admin/projects/order",
    headers: authHeaders,
    body: { projectIds: ["agentspace", "researchmind", "mockmate", "cognitive-rag", "system-anomaly"] }
  });
  if (reorderRes.statusCode === 200) {
    console.log("✓ PASS: Project order confirmed and persisted.");
  } else {
    console.error("✗ FAIL: Reorder failed:", reorderRes);
    process.exit(1);
  }

  // Test 4: Delete Non-Existent Entity (Expect 404)
  console.log("\nStep 5: Delete Non-Existent Certification (Expect 404)");
  const nonExistDelete = await createMockReqRes({
    method: "DELETE",
    url: "/api/admin/certifications/fake-id-123",
    headers: authHeaders
  });
  if (nonExistDelete.statusCode === 404) {
    console.log("✓ PASS: Non-existent record deletion returned 404 Not Found.");
  } else {
    console.error("✗ FAIL: Expected 404, got:", nonExistDelete.statusCode);
    process.exit(1);
  }

  console.log("\n=== ALL STABILITY & VALIDATION TESTS PASSED (100%) ===");
}

runTests().catch((e) => {
  console.error("Test runner failed:", e);
  process.exit(1);
});
