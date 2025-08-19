 //*****open and close details modal*****
  function openDetailsModal(student) {
  document.getElementById('detailsName').textContent = student.name;
  document.getElementById('detailsEmail').textContent = student.email;
  document.getElementById('detailsPhone').textContent = student.phone || 'N/A';
  document.getElementById('detailsDOB').textContent = student.dob || 'N/A';

  document.getElementById('detailsModal').style.display = 'flex';
}

function closeDetailsModal(event) {
  event.preventDefault();
  document.getElementById('detailsModal').style.display = 'none';
}
//****end*******


// ****Open "Add Student" modal******
document.getElementById("addModal").addEventListener("click", () => {
  document.getElementById("addStudentModal").style.display = "flex";
});


function closeAddStudentModal(event) {
  event.preventDefault();
  document.getElementById("addStudentModal").style.display = "none";
}
//*****End******


//********open and close DeleteModal*******
 function openDeleteModal(id, name) {
    document.getElementById('deleteStudentId').value = id;
    document.getElementById('confirmDeleteText').textContent =
      `Are you sure you want to delete student "${name}"?`;
    document.getElementById('confirmDeleteModal').style.display = 'flex';
  }

  function closeDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
  }
  //*******End**************


  //*****Open and close editModal*****
  function openEditStudentModal(id, name, email, phone, dob) {
    document.getElementById("editStudentId").value = id;
    document.getElementById("editStudentName").value = name;
    document.getElementById("editStudentEmail").value = email;
    document.getElementById("editStudentPhone").value = phone;
    document.getElementById("editDob").value = dob;
    document.getElementById("editStudentModal").style.display = "flex";
  }

  function closeEditStudentModal(event) {
    event.preventDefault();
    document.getElementById("editStudentModal").style.display = "none";
  }
  //*****end********
 
  

  const modal = document.querySelector('.detailsModal');

  // Add a click listener to close any modal when clicking outside of its content
  window.addEventListener("click", function (event) {
    // Select all modals
    const modals = document.querySelectorAll(".detailsModal");

    modals.forEach((modal) => {
      // If the click target *is* the modal background (not the content inside)
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });